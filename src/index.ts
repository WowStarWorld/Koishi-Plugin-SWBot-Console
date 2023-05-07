import { Context, Schema } from 'koishi';
import { resolve } from 'path';
import {} from '@koishijs/plugin-console';
import type { PlayerMeta } from "koishi-plugin-swbot/src/core";

export function sum (array: number[]) {
	let number = 0;
	array.forEach(num => number += Number(num));
	return number;
}

export const name = 'swbot-console';
export const using = ["console", "swbot"];

export interface Config {}

export const Config: Schema<Config> = Schema.object({});

let context: Context;

declare module '@koishijs/plugin-console' {
	interface Events {
		['swbot/players/count']: () => Promise<number>,
		['swbot/players/list']: () => Promise<string[]>,
		['swbot/players/data']: (id: string) => Promise<PlayerMeta | null>
		['swbot/players/purse/all']: () => Promise<number>
	}
}

export function getContext () {
	return context;
}

export function apply (ctx: Context) {
	context = ctx;
	ctx.console.addEntry(
		{
			dev: resolve(__dirname, '../client/index.ts'),
			prod: resolve(__dirname, '../dist'),
		}
	);
	ctx.console.addListener(
		"swbot/players/count", async () => (await ctx.database.get("swbot.players", {})).length
	);
	ctx.console.addListener(
		"swbot/players/list", async () => (await ctx.database.get("swbot.players", {})).map(i => i.id), {authority: 5}
	);
	ctx.console.addListener(
		"swbot/players/data", async (id) => (await ctx.database.get("swbot.players", {id}))?.[0] ?? null, {authority: 5}
	);
	ctx.console.addListener(
		"swbot/players/purse/all", async () => sum((await ctx.database.get("swbot.players", {})).map(i => i.purse))
	);
}

