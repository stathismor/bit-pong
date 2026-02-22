const modules = import.meta.glob('../../assets/images/*.png', { eager: true, query: '?url', import: 'default' });

const Images: Record<string, string> = {};
for (const path in modules) {
  const key = path.split('/').pop()!.replace('.png', '');
  Images[key] = modules[path] as string;
}

export default Images;
