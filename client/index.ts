import { type Context } from '@koishijs/client';
import PageIndex from './pages/Index.vue';

export default (ctx: Context) => {
	ctx.page(
		{
			name: `SWBot`,
			path: '/swbot',
			component: PageIndex,
			authority: 5,
		}
	);
};
