import { Request } from 'express';
import CoffeeChatDao from '../dao/CoffeeChatDao';
import PermissionsManager from '../utils/permissionsManager';
import { BadRequestError, PermissionError } from '../utils/errors';
import { getMember, allMembers } from './memberAPI';
import { LEAD_ROLES } from '../consts';
import { getGeneralRoleFromLeadType } from '../utils/memberUtil';
import { sendCoffeeChatReminder } from './mailAPI';

const coffeeChatDao = new CoffeeChatDao();

/**
 * Gets all coffee chats
 */
export const getAllCoffeeChats = (): Promise<CoffeeChat[]> => coffeeChatDao.getAllCoffeeChats();

/**
 * Gets all coffee chats for a user
 * @param user - user requesting to fetch coffee chats
 * @param email - email of user whose coffee chats should be fetched
 */
export const getCoffeeChatsByUser = async (
  user: IdolMember,
  email: string
): Promise<CoffeeChat[]> => {
  const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  if (!isLeadOrAdmin && email !== user.email) {
    throw new PermissionError(
      `User with email ${user.email} does not have permissions to get coffee chats for user with email ${email}.`
    );
  }

  const coffeeChats = coffeeChatDao.getCoffeeChatsByUser(email);
  return coffeeChats;
};

/**
 * Creates a new coffee chat for member
 * @param coffeeChat - Newly created CoffeeChat object
 * @param user - user who is submitting the coffee chat
 * A member can not coffee chat themselves.
 * A member can not coffee chat the same person from previous semesters.
 */
export const createCoffeeChat = async (
  coffeeChat: CoffeeChat,
  user: IdolMember
): Promise<CoffeeChat> => {
  const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  if (!isLeadOrAdmin && coffeeChat.submitter.email !== user.email) {
    throw new PermissionError(
      `User with email ${user.email} does not have permissions to create coffee chat.`
    );
  }

  if (coffeeChat.submitter.email === coffeeChat.otherMember.email) {
    throw new Error('Cannot create coffee chat with yourself.');
  }

  const pendingChats = await coffeeChatDao.getCoffeeChatsByUser(
    coffeeChat.submitter.email,
    'pending',
    coffeeChat.otherMember
  );
  const approvedChats = await coffeeChatDao.getCoffeeChatsByUser(
    coffeeChat.submitter.email,
    'approved',
    coffeeChat.otherMember
  );
  const prevChats = [...pendingChats, ...approvedChats];
  const chatExists = prevChats.length > 0;

  if (chatExists) {
    throw new Error(
      'Cannot create coffee chat with member. Previous coffee chats from previous semesters exist.'
    );
  }

  const newCoffeeChat = await coffeeChatDao.createCoffeeChat(coffeeChat);
  return newCoffeeChat;
};

/**
 * Updates a coffee chat (if the user has permission)
 * @param coffeeChat - The updated CoffeeChat object
 * @param user - The user that is requesting to update the coffee chat
 */
export const updateCoffeeChat = async (
  coffeeChat: CoffeeChat,
  user: IdolMember
): Promise<CoffeeChat> => {
  const canEditCoffeeChat = await PermissionsManager.canEditCoffeeChat(user);
  if (!canEditCoffeeChat) {
    throw new PermissionError(
      `User with email ${user.email} does not have permissions to update coffee chat.`
    );
  }

  await coffeeChatDao.updateCoffeeChat(coffeeChat);
  return coffeeChat;
};

/**
 * Deletes a coffee chat (if the user has permission)
 * @param uuid - DB uuid of CoffeeChat
 * @param user - The user that is requesting to delete a coffee chat
 */
export const deleteCoffeeChat = async (uuid: string, user: IdolMember): Promise<void> => {
  const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  const coffeeChat = await coffeeChatDao.getCoffeeChat(uuid);

  if (!coffeeChat) return;

  if (!isLeadOrAdmin && coffeeChat.submitter.email !== user.email) {
    throw new PermissionError(
      `User with email ${user.email} does not have sufficient permissions to delete coffee chat.`
    );
  }
  await coffeeChatDao.deleteCoffeeChat(uuid);
};

/**
 * Deletes all coffee chats (if the user has permission)
 * @param user - The user that is requesting to delete all coffee chats
 */
export const clearAllCoffeeChats = async (user: IdolMember): Promise<void> => {
  const isClearAllCoffeeChatsDisabled = await PermissionsManager.isClearAllCoffeeChatsDisabled();
  if (isClearAllCoffeeChatsDisabled) {
    throw new PermissionError('Clearing all Coffee Chats is disabled');
  }
  const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  if (!isLeadOrAdmin) {
    throw new PermissionError(
      `User with email ${user.email} does not have sufficient permissions to delete all coffee chats.`
    );
  }
  await CoffeeChatDao.clearAllCoffeeChats();
};

/**
 * Gets the coffee chat bingo board
 */
export const getCoffeeChatBingoBoard = (): Promise<string[][]> =>
  CoffeeChatDao.getCoffeeChatBingoBoard();

/**
 * Gets coffee chat suggestions for a specifc member
 * @param email - the email of the member
 * @returns A promise that resolves to a CoffeeChatSuggestions object.
 */
export const getCoffeeChatSuggestions = async (email: string): Promise<CoffeeChatSuggestions> => {
  const suggestions = await CoffeeChatDao.getCoffeeChatSuggestions(email);
  if (!suggestions) {
    throw new BadRequestError(
      `Coffee chat suggestions does not exist for member with email ${email}`
    );
  }
  return suggestions;
};

/**
 * Checks if a member meets a category for the specified coffee chat.
 * @param uuid - the uuid of the coffee chats we are checking.
 * @param user - the IdolMember making the request.
 * @returns the updated coffee chat
 */
export const runAutoChecker = async (uuid: string, user: IdolMember): Promise<CoffeeChat> => {
  const canRunAutoChecker = await PermissionsManager.isLeadOrAdmin(user);
  if (!canRunAutoChecker)
    throw new PermissionError(
      `User with email ${user.email} does not have permission to run auto checker`
    );

  const coffeeChat = await coffeeChatDao.getCoffeeChat(uuid);
  if (!coffeeChat) {
    throw new BadRequestError(`Coffee chat with uuid: ${uuid} does not exist`);
  }

  const result = await checkMemberMeetsCategory(
    coffeeChat.otherMember.email,
    coffeeChat.submitter.email,
    coffeeChat.category
  );

  const updatedCC = {
    ...coffeeChat,
    memberMeetsCategory: result.status,
    errorMessage: result.message
  };
  await coffeeChatDao.updateCoffeeChat(updatedCC);

  return updatedCC;
};

/**
 * Checks if a member meets a category.
 * @param otherMemberEmail - the email of the member we are checking.
 * @param submitterEmail - the email of the member that submitted the coffee chat.
 * @param category - the category we are checking with.
 * @returns 'pass' if a member meets a category, 'fail' if not, 'no data' if not enough data to know.
 */
export const checkMemberMeetsCategory = async (
  otherMemberEmail: string,
  submitterEmail: string,
  category: string
): Promise<{ status: MemberMeetsCategoryStatus; message: string }> => {
  const otherMemberProperties = await CoffeeChatDao.getMemberProperties(otherMemberEmail);
  const submitterProperties = await CoffeeChatDao.getMemberProperties(submitterEmail);
  const otherMember = await getMember(otherMemberEmail);
  const submitter = await getMember(submitterEmail);
  const haveNoCommonSubteams = (member1: IdolMember, member2: IdolMember): boolean =>
    member2.subteams.every((team) => !member1.subteams.includes(team)) &&
    member1.subteams.every((team) => !member2.subteams.includes(team));
  let status: MemberMeetsCategoryStatus = 'no data';
  let message: string = '';

  // If otherMember doesn't exist in the DB, assume they are an alumni
  if (!otherMember && category === 'an alumni') {
    return { status: 'pass', message };
  }

  // If otherMember and submitter don't exist, status should stay undefined
  if (otherMember && submitter) {
    if (category === 'an alumni') {
      status = (await allMembers()).every((member) => member.email !== otherMember.email)
        ? 'pass'
        : 'fail';
      if (status === 'fail') {
        message = `${otherMember.firstName} ${otherMember.lastName} is not an alumni`;
      }
    } else if (category === 'courseplan member') {
      status = otherMember.subteams.includes('courseplan') ? 'pass' : 'fail';
      if (status === 'fail') {
        message = `${otherMember.firstName} ${otherMember?.lastName} is not a CoursePlan member`;
      }
    } else if (category === 'business member') {
      status = otherMember.role === 'business' ? 'pass' : 'fail';
      if (status === 'fail') {
        message = `${otherMember.firstName} ${otherMember.lastName} is not a business member`;
      }
    } else if (category === 'idol member') {
      status = otherMember.subteams.includes('idol') ? 'pass' : 'fail';
      if (status === 'fail') {
        message = `${otherMember.firstName} ${otherMember.lastName} is not an IDOL member`;
      }
    } else if (category === 'curaise member') {
      status = otherMember.subteams.includes('curaise') ? 'pass' : 'fail';
      if (status === 'fail') {
        message = `${otherMember.firstName} ${otherMember.lastName} is not a CURaise member`;
      }
    } else if (category === 'cornellgo member') {
      status = otherMember.subteams.includes('cornellgo') ? 'pass' : 'fail';
      if (status === 'fail') {
        message = `${otherMember.firstName} ${otherMember.lastName} is not a CornellGo member`;
      }
    } else if (category === 'carriage member') {
      status = otherMember.subteams.includes('carriage') ? 'pass' : 'fail';
      if (status === 'fail') {
        message = `${otherMember.firstName} ${otherMember.lastName} is not a Carriage member`;
      }
    } else if (category === 'qmi member') {
      status = otherMember.subteams.includes('queuemein') ? 'pass' : 'fail';
      if (status === 'fail') {
        message = `${otherMember.firstName} ${otherMember.lastName} is not a QMI member`;
      }
    } else if (category === 'cuapts member') {
      status = otherMember.subteams.includes('cuapts') ? 'pass' : 'fail';
      if (status === 'fail') {
        message = `${otherMember.firstName} ${otherMember.lastName} is not a CUApts member`;
      }
    } else if (category === 'a pm (not your team)') {
      const isPm = otherMember.role === 'pm';
      const notSameTeam = haveNoCommonSubteams(submitter, otherMember);
      status = isPm && notSameTeam ? 'pass' : 'fail';
      if (status === 'fail') {
        if (!isPm) {
          message = `${otherMember.firstName} ${otherMember.lastName} is not a PM`;
        } else {
          message = `${otherMember.firstName} ${otherMember.lastName} is a PM, but is on the same team as ${submitter?.firstName} ${submitter?.lastName}`;
        }
      }
    } else if (category === 'a tpm (not your team)') {
      const isTpm = otherMember.role === 'tpm';
      const notSameTeam = haveNoCommonSubteams(submitter, otherMember);
      status = isTpm && notSameTeam ? 'pass' : 'fail';
      if (status === 'fail') {
        if (!isTpm) {
          message = `${otherMember.firstName} ${otherMember.lastName} is not a TPM`;
        } else {
          message = `${otherMember.firstName} ${otherMember.lastName} is a TPM, but is on the same team as ${submitter?.firstName} ${submitter?.lastName}`;
        }
      }
    }

    // If otherMemberProperties doesn't exist, status should stay undefined
    if (otherMemberProperties) {
      if (category === 'a newbie') {
        status = otherMemberProperties.newbie ? 'pass' : 'fail';
        if (status === 'fail') {
          message = `${otherMember.firstName} ${otherMember.lastName} is not a newbie`;
        }
      } else if (category === 'is/was a TA') {
        status = otherMemberProperties.ta ? 'pass' : 'fail';
        if (status === 'fail') {
          message = `${otherMember.firstName} ${otherMember.lastName} was never a TA`;
        }
      } else if (category === 'major/minor that is not cs/infosci') {
        status = otherMemberProperties.notCsOrInfosci ? 'pass' : 'fail';
        if (status === 'fail') {
          message = `${otherMember.firstName} ${otherMember.lastName} is a CS or Infosci major`;
        }
      }

      // If submitterProperties doesn't exist, status should stay undefined
      if (submitterProperties) {
        if (category === 'from a different college') {
          status = otherMemberProperties.college !== submitterProperties.college ? 'pass' : 'fail';
          if (status === 'fail') {
            message = `${otherMember.firstName} ${otherMember.lastName} is from the same college as ${submitter.firstName} ${submitter.lastName} (${otherMemberProperties.college})`;
          }
        }
      }
    }

    if (category === 'a lead (not your role)') {
      const isLead = LEAD_ROLES.includes(otherMember.role);
      if (!isLead) {
        status = 'fail';
        message = `${otherMember.firstName} ${otherMember.lastName} is not a lead`;
      } else {
        const diffRole = !LEAD_ROLES.includes(submitter.role)
          ? getGeneralRoleFromLeadType(otherMember.role) !== submitter.role
          : getGeneralRoleFromLeadType(otherMember.role) !==
            getGeneralRoleFromLeadType(submitter.role);
        status = diffRole ? 'pass' : 'fail';
        if (!diffRole) {
          message = `${otherMember.firstName} ${otherMember.lastName} is a lead, but from the same role (${submitter.role}) as ${submitter.firstName} ${submitter.lastName}`;
        }
      }
    }
  }
  return { status, message };
};

/**
 * Reminds a member about submitting coffee chats this semester.
 * @param req - the post request being made by the user
 * @param member - the member being notified
 * @param user - the user trying to notify the member
 * @throws PermissionError if the user does not have permissions to notify members
 * @returns the body of the request, which contains details about the member being notified
 */
export const notifyMemberCoffeeChat = async (
  req: Request,
  member: IdolMember,
  user: IdolMember
): Promise<unknown> => {
  const canNotify = await PermissionsManager.canNotifyMembers(user);
  if (!canNotify) {
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to notify members!`
    );
  }
  if (!member.email || member.email === '') {
    throw new BadRequestError("Couldn't notify member with undefined email!");
  }
  const responseBody = await sendCoffeeChatReminder(req, member);
  return responseBody.data;
};
