/** Match the existing member-facing name/tag lookup (receivers are free text). */
export default function receivedShoutouts(
  shoutouts: Shoutout[],
  firstName: string,
  lastName: string
): Shoutout[] {
  const names = [firstName, lastName, `${firstName} ${lastName}`]
    .map((name) => name.trim().toLowerCase())
    .filter(Boolean);
  return shoutouts.filter((shoutout) =>
    [shoutout.receiver, ...(shoutout.tags ?? [])].some((text) =>
      names.some((name) => text.toLowerCase().includes(name))
    )
  );
}
