import { memo } from 'react';
import { Trash2 } from 'lucide-react';

const getTrackCount = (playlist) => {
  if (!playlist) {
    return 0;
  }

  if (typeof playlist.track_count === 'number') {
    return playlist.track_count;
  }

  if (typeof playlist.trackCount === 'number') {
    return playlist.trackCount;
  }

  if (Array.isArray(playlist.tracks)) {
    return playlist.tracks.length;
  }

  return 0;
};

const PlaylistItem = memo(function PlaylistItem({ playlist, isSelected, onSelectPlaylist, onDeletePlaylist }) {
  const trackCount = getTrackCount(playlist);

  return (
    <div role="listitem" className="group relative">
      <button
        type="button"
        onClick={() => onSelectPlaylist(playlist.id)}
        className={`
          group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
          cursor-pointer text-left w-full min-h-[52px] pr-12
          focus-visible:outline-2 focus-visible:outline-gray-900
          ${isSelected
            ? 'surface-raised text-gray-900'
            : 'hover:bg-black/[0.04] text-gray-500 hover:text-gray-800'}
        `}
        aria-current={isSelected ? 'page' : undefined}
        aria-label={`${playlist.name}, ${trackCount} tracks`}
        id={`playlist-item-${playlist.id}`}
      >
        <div
          className={`
            shrink-0 w-10 h-10 flex items-center justify-center
            font-black text-sm uppercase rounded-xl transition-colors duration-200 leading-none
            ${isSelected ? 'bg-gray-900 text-white' : 'bg-black/[0.05] text-gray-600'}
          `}
          aria-hidden="true"
        >
          {playlist.name.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          <p
            className={`
              truncate text-sm leading-tight font-bold tracking-tight
              ${isSelected ? 'text-gray-900' : 'text-gray-700'}
            `}
          >
            {playlist.name}
          </p>
          <p className="text-caption mt-0.5">
            {trackCount} tracks
          </p>
        </div>
      </button>

      <button
        type="button"
        onClick={() => {
          if (window.confirm(`Delete "${playlist.name}"?`)) onDeletePlaylist?.(playlist.id);
        }}
        className={`
          absolute right-2 top-1/2 -translate-y-1/2
          min-w-[36px] min-h-[36px] flex items-center justify-center shrink-0
          rounded-lg transition-all duration-150
          hover:bg-red-50 hover:text-red-500
          ${isSelected ? 'opacity-60' : 'opacity-0 group-hover:opacity-60'}
          focus-visible:opacity-100
        `}
        aria-label={`Delete ${playlist.name} playlist`}
        id={`delete-playlist-${playlist.id}`}
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
});

const PlaylistSidebar = ({
  playlists,
  isLoading,
  selectedPlaylistId,
  onSelectPlaylist,
  onDeletePlaylist,
}) => {
  return (
    <div className="flex flex-col gap-1" role="list" aria-label="Your playlists">
      {isLoading ? (
        <div className="space-y-2 px-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-3 items-center p-3 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-black/[0.05] skeleton-shimmer shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-2.5 w-3/5 bg-black/[0.05] rounded-full skeleton-shimmer" />
                <div className="h-2 w-2/5 bg-black/[0.03] rounded-full skeleton-shimmer" />
              </div>
            </div>
          ))}
        </div>
      ) : playlists.length ? (
        playlists.map((playlist) => {
          const isSelected = playlist.id?.toString() === selectedPlaylistId?.toString();

          return (
            <PlaylistItem
              key={playlist.id}
              playlist={playlist}
              isSelected={isSelected}
              onSelectPlaylist={onSelectPlaylist}
              onDeletePlaylist={onDeletePlaylist}
            />
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <p className="text-label">No Playlists Yet</p>
        </div>
      )}
    </div>
  );
};

export default memo(PlaylistSidebar);
