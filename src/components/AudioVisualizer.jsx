export default function AudioVisualizer({ isPlaying }) {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="absolute -top-[20vw] -left-[15vw] rounded-full"
        style={{
          width:  '45vw',
          height: '45vw',
          background: 'radial-gradient(circle, rgba(0,0,0,0.06), transparent 70%)',
          filter: 'blur(80px)',
          animation: isPlaying
            ? 'orbPulse 5s ease-in-out infinite alternate'
            : 'orbIdle 8s ease-in-out infinite alternate',
          transition: 'opacity 1.5s ease',
        }}
      />

      <div
        className="absolute -bottom-[15vw] -right-[10vw] rounded-full"
        style={{
          width:  '38vw',
          height: '38vw',
          background: 'radial-gradient(circle, rgba(0,0,0,0.05), transparent 70%)',
          filter: 'blur(100px)',
          animation: isPlaying
            ? 'orbPulse 4s ease-in-out infinite alternate-reverse'
            : 'orbIdle 7s ease-in-out infinite alternate-reverse',
          transition: 'opacity 1.5s ease',
        }}
      />
    </div>
  );
}
