import { reimbursementTeamCollection } from '../firebase';
import BaseDao from './BaseDao';

export default class ReimbursementTeamDao extends BaseDao<ReimbursementTeam, ReimbursementTeam> {
  constructor() {
    super(
      reimbursementTeamCollection,
      async (team) => team,
      async (team) => team
    );
  }

  /**
   * Gets all reimbursement teams
   * @returns A `ReimbursementTeam` list with all teams
   */
  async getAllTeams(): Promise<ReimbursementTeam[]> {
    return this.getDocuments();
  }

  /**
   * Gets a reimbursement team by its teamId
   * @param teamId - The team ID
   * @returns The `ReimbursementTeam` with a matching teamId (null if it doesn't exist)
   */
  async getTeam(teamId: string): Promise<ReimbursementTeam | null> {
    return this.getDocument(teamId);
  }

  /**
   * Gets all teams assigned to a specific admin
   * @param adminId - The admin user ID
   * @returns List of `ReimbursementTeam` assigned to the admin
   */
  async getTeamsByAdmin(adminId: string): Promise<ReimbursementTeam[]> {
    return this.getDocuments([
      { field: 'assignedAdmins', comparisonOperator: 'array-contains', value: adminId }
    ]);
  }

  /**
   * Creates a new reimbursement team
   * @param team - The team data
   * @returns The newly created `ReimbursementTeam`
   */
  async createTeam(team: ReimbursementTeam): Promise<ReimbursementTeam> {
    return this.createDocument(team.teamId, team);
  }

  /**
   * Updates a reimbursement team
   * @param team - The updated team data
   * @returns The updated `ReimbursementTeam`
   */
  async updateTeam(team: ReimbursementTeam): Promise<ReimbursementTeam> {
    return this.updateDocument(team.teamId, team);
  }

  /**
   * Deletes a reimbursement team
   * @param teamId - The team ID
   */
  async deleteTeam(teamId: string): Promise<void> {
    return this.deleteDocument(teamId);
  }

  /**
   * Updates the total spent amount for a team
   * @param teamId - The team ID
   * @param amount - The amount to add to totalSpent
   */
  async updateTotalSpent(teamId: string, amount: number): Promise<ReimbursementTeam> {
    const team = await this.getTeam(teamId);
    if (!team) {
      throw new Error(`Team with ID ${teamId} not found`);
    }
    const updatedTeam = {
      ...team,
      totalSpent: team.totalSpent + amount
    };
    return this.updateTeam(updatedTeam);
  }

  /**
   * Resets the budget state for a team (typically done at the start of each semester)
   * @param teamId - The team ID
   * @param newBudget - Optional new budget amount (if not provided, keeps current budget)
   * @returns The updated `ReimbursementTeam`
   */
  async resetTeamBudget(teamId: string, newBudget?: number): Promise<ReimbursementTeam> {
    const team = await this.getTeam(teamId);
    if (!team) {
      throw new Error(`Team with ID ${teamId} not found`);
    }
    const updatedTeam = {
      ...team,
      budget: newBudget !== undefined ? newBudget : team.budget,
      totalSpent: 0
    };
    return this.updateTeam(updatedTeam);
  }

  /**
   * Resets all team budgets (typically done at the start of each semester)
   * @param newBudgets - Optional map of teamId to new budget amount
   * @returns Array of updated `ReimbursementTeam`
   */
  async resetAllTeamBudgets(newBudgets?: Record<string, number>): Promise<ReimbursementTeam[]> {
    const teams = await this.getAllTeams();
    const updates = teams.map((team) => {
      const newBudget = newBudgets?.[team.teamId];
      return this.resetTeamBudget(team.teamId, newBudget);
    });
    return Promise.all(updates);
  }
}
