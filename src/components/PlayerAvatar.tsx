interface PlayerAvatarProps {
  name: string;
  image: string | null;
  className?: string;
}

/** Player portrait with an elegant monogram fallback when no photo exists. */
export default function PlayerAvatar({ name, image, className = '' }: PlayerAvatarProps) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  if (image) {
    return (
      <img
        src={image}
        alt={name}
        loading="lazy"
        className={`object-cover ${className}`}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
        }}
      />
    );
  }
  return (
    <div
      className={`flex items-center justify-center bg-surface-2 font-serif text-2xl text-fairway dark:text-gold-soft ${className}`}
    >
      {initials}
    </div>
  );
}
