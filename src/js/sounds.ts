const modules = import.meta.glob('../../assets/sounds/*.mp3', { eager: true, query: '?url', import: 'default' });

const Sounds: Record<string, string> = {};
for (const path in modules) {
  const key = path.split('/').pop()!.replace('.mp3', '');
  Sounds[key] = modules[path] as string;
}

export default Sounds;
