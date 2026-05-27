export function getUserAvatarUrl(
  userCode?: string,
  avatarUrl?: string | null,
  tone?: "me" | "hashim" | "plain",
) {
  if (avatarUrl) {
    return avatarUrl;
  }

  if (userCode === "haris") {
    return "/avatars/haris.webp";
  }

  if (userCode === "hashim") {
    return "/avatars/hashim.webp";
  }

  if (tone === "me") {
    return "/avatars/haris.webp";
  }

  return null;
}
