export const timeAgo = (dateISO: string) => {
  const date = new Date(dateISO);
  const now = new Date();

  const diff = (now.getTime() - date.getTime()) / 1000;

  if (diff < 60) return "hace unos segundos";
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
  if (diff < 604800) return `hace ${Math.floor(diff / 86400)} d`;
  if (diff < 2592000) return `hace ${Math.floor(diff / 604800)} sem`;
  if (diff < 31536000) return `hace ${Math.floor(diff / 2592000)} mes`;
  return `hace ${Math.floor(diff / 31536000)} año`;
};
