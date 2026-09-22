declare module 'virtual:course-index' {
	import type { IndexedModule } from '$lib/build/course-index';
	const modules: IndexedModule[];
	export default modules;
}
