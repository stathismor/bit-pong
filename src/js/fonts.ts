const modules = import.meta.glob('../../assets/fonts/*.xml', { eager: true, query: '?url', import: 'default' });

const Fonts: Record<string, string> = {};
for (const path in modules) {
  const key = path.split('/').pop()!.replace('.xml', '');
  Fonts[key] = modules[path] as string;
}

export default Fonts;
