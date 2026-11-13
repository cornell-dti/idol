import { searchPages } from './searchPages';

const top = (query: string, canAdmin = false) => searchPages(query, canAdmin, [])[0]?.href;

describe('searchPages', () => {
  it.each([
    ['submit tec', '/forms/teamEventCredits'],
    ['Submit TEC', '/forms/teamEventCredits'],
    ['submit a tec', '/forms/teamEventCredits'],
    ['i want to submit my tec', '/forms/teamEventCredits'],
    ['how do i request team event credits', '/forms/teamEventCredits'],
    ['log hours', '/forms/teamEventCredits'],
    ['check my tecs', '/forms/teamEventCredits'],
    ['team event credit', '/forms/teamEventCredits'],
    ['give a shoutout', '/forms/shoutouts'],
    ['send someone a shout out', '/forms/shoutouts'],
    ['submit coffee chat', '/forms/coffeeChats'],
    ['where do i log coffee chats', '/forms/coffeeChats'],
    ['submit coffee chat categories', '/forms/coffeeChatCategories'],
    ['submit dev portfolio', '/forms/devPortfolio'],
    ['submit pr', '/forms/devPortfolio'],
    ['submit pull requests', '/forms/devPortfolio'],
    ['request reimbursement', '/forms/reimbursement'],
    ['get reimbursed', '/forms/reimbursement'],
    ['submit expense report', '/forms/reimbursement'],
    ['edit profile', '/forms/profile'],
    ['update my profile picture', '/forms/profile'],
    ['change pronouns', '/forms/profile'],
    ['view alumni', '/alumni'],
    ['change theme', '/settings'],
    ['dark mode', '/settings'],
    ['report a bug', '/help'],
    ['tec', '/forms/teamEventCredits'],
    ['shoutouts', '/forms/shoutouts']
  ])('"%s" finds %s', (query, href) => {
    expect(top(query)).toBe(href);
  });

  it.each([
    ['submit tec', '/forms/teamEventCredits'],
    ['edit user', '/admin/edit'],
    ['add a member', '/admin/edit'],
    ['deploy the website', '/admin/site-deployer'],
    ['approve coffee chats', '/admin/coffee-chats']
  ])('"%s" finds %s for admins', (query, href) => {
    expect(top(query, true)).toBe(href);
  });

  it('still requires the subject of the request to match', () => {
    expect(searchPages('submit zebra', true, [])).toEqual([]);
  });

  it('matches action words on their own', () => {
    const hrefs = searchPages('submit', false, []).map(({ href }) => href);
    expect(hrefs).toEqual(
      expect.arrayContaining(['/forms/teamEventCredits', '/forms/coffeeChats'])
    );
  });

  it('keeps admin pages out of member results', () => {
    expect(searchPages('edit user', false, []).some(({ href }) => href.startsWith('/admin'))).toBe(
      false
    );
  });
});
