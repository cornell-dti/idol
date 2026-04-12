/// <reference types="common-types" />

const EXPECTED_CATEGORY_COUNT = 16;
const CSV_CATEGORY_OFFSET = 3;

/**
 * Parses a CSV export into an array of CoffeeChatCategory objects.
 *
 * Expected CSV format: Timestamp, Full Name, NetId, <category1>, <category2>, ..., <category16>
 * Data rows have "yes"/"no" values for each category column.
 *
 * The category name and its grid index (0–15) are derived from the
 * CSV header, and if a member submitted multiple times, the latest response is kept
 *
 * @param csvString - raw CSV content as a string
 * @param members - list of members
 * @returns array of 16 CoffeeChatCategory objects, sorted by index
 */
export function parseCoffeeChatCSV(csvString: string, members: IdolMember[]): CoffeeChatCategory[] {
  const memberByNetID = new Map(members.map((m) => [m.netid.trim().toLowerCase(), m] as const));

  const rows = csvString.split(/\r?\n/);
  const headerCells = rows[0].split(',');
  const categoryNames = headerCells.slice(CSV_CATEGORY_OFFSET).map((c) => c.trim());

  if (categoryNames.length !== EXPECTED_CATEGORY_COUNT) {
    throw new Error(
      `CSV must have exactly ${EXPECTED_CATEGORY_COUNT} categories after the first 3 columns, ` +
        `but found ${categoryNames.length}. Check that the header row matches the expected format.`
    );
  }

  let responses = rows.slice(1).filter((r) => r.trim() !== '');

  const seenNetIds = new Set<string>();
  responses = responses
    .reverse()
    .filter((response) => {
      const netid = response.split(',')[2]?.trim().toLowerCase();
      if (!netid || seenNetIds.has(netid)) return false;
      seenNetIds.add(netid);
      return true;
    })
    .reverse();

  const toMemberDetails = (mem: IdolMember): MemberDetails => ({
    name: `${mem.firstName} ${mem.lastName}`,
    netid: mem.netid
  });

  return categoryNames.map((name, index) => {
    const categoryMembers = responses
      .filter((response) => {
        const cells = response.split(',');
        return cells[CSV_CATEGORY_OFFSET + index]?.trim().toLowerCase() === 'yes';
      })
      .map((response) => {
        const netid = response.split(',')[2]?.trim().toLowerCase();
        return netid ? memberByNetID.get(netid) : undefined;
      })
      .filter((m): m is IdolMember => m !== undefined)
      .map(toMemberDetails);

    return { name, members: categoryMembers, index };
  });
}
