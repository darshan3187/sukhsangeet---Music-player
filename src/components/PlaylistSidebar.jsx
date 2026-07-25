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
          group flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-150
          cursor-pointer text-left w-full min-h-[44px] pr-10 relative
          ${isSelected
            ? 'bg-[#fafafa] border border-[#ebebeb] text-[#171717] shadow-level-1 font-semibold'
            : 'hover:bg-[#fafafa] border border-transparent text-[#4d4d4d] hover:text-[#171717]'}
        `}
        aria-current={isSelected ? 'page' : undefined}
        aria-label={`${playlist.name}, ${trackCount} tracks`}
        id={`playlist-item-${playlist.id}`}
      >
        {/* Left edge active indicator */}
        {isSelected && (
          <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#171717] rounded-r-full" />
        )}

        <div
          className={`
            shrink-0 w-7 h-7 flex items-center justify-center
            font-mono text-xs font-medium uppercase rounded-md transition-colors duration-150 leading-none
            ${isSelected ? 'bg-[#171717] text-white' : 'bg-[#f5f5f5] text-[#4d4d4d] border border-[#ebebeb]'}
          `}
          aria-hidden="true"
        >
          {playlist.name.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          <p
            className={`
              truncate text-xs leading-tight font-medium
              ${isSelected ? 'text-[#171717]' : 'text-[#4d4d4d] group-hover:text-[#171717]'}
            `}
          >
            {playlist.name}
          </p>
          <p className="font-mono text-[10px] text-[#888888] mt-0.5">
            {trackCount} {trackCount === 1 ? 'track' : 'tracks'}
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
          w-7 h-7 flex items-center justify-center shrink-0
          rounded-md transition-all duration-150 cursor-pointer
          hover:bg-[#f7d4d6]/40 hover:text-[#ee0000] text-[#888888]
          ${isSelected ? 'opacity-80' : 'opacity-0 group-hover:opacity-80'}
          focus-visible:opacity-100
        `}
        aria-label={`Delete ${playlist.name} playlist`}
        id={`delete-playlist-${playlist.id}`}
      >
        <Trash2 size={13} />
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
            <div key={i} className="flex gap-3 items-center p-2.5 rounded-md border border-[#ebebeb] bg-white">
              <div className="w-7 h-7 rounded-md bg-[#f5f5f5] shrink-0 animate-pulse" />
              <div className="flex-1 space-y-1.5">
                <div className="h-2 w-3/5 bg-[#f5f5f5] rounded-full animate-pulse" />
                <div className="h-2 w-2/5 bg-[#f5f5f5] rounded-full animate-pulse" />
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
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <p className="font-mono text-xs text-[#888888]">No Playlists Created</p>
        </div>
      )}
    </div>
  );
};

export default memo(PlaylistSidebar);
