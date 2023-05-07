<!--suppress VueUnrecognizedSlot -->
<template>
	<koishi-layout>
		<template #header>
			[SWBot] {{ currentPage?.title ?? currentPage?.name ?? currentPage?.id ?? "未知" }}
		</template>
		<template #menu>
			<span class="menu-item" @click.stop.prevent="load()">
				<el-icon><refresh/></el-icon>
      		</span>
		</template>
		<template #left>
			<el-scrollbar class="nav-tree" ref="root">
				<el-tree :data="pages" @node-click="(data) => currentPage = data" :props="{label: 'name'}"/>
			</el-scrollbar>
		</template>
		<!--卡片-->
		<div>
			<koishi-card class="swbot-card" v-if="currentPage.id === 'player'">
				<h1>玩家</h1>
				<p>总数：{{ data.playerCount }}</p>
			</koishi-card>
			<koishi-card class="swbot-card" v-if="currentPage.id === 'economy'">
				<h1>经济</h1>
				<p>总财富: {{ data.playerAllPurse }}</p>
				<p>平均财富: {{ data.playerAllPurse }}</p>
			</koishi-card>
		</div>
	</koishi-layout>
</template>

<script setup lang="ts">

import { KoishiButton, KoishiCard, KoishiLayout, ElTable, ElTableColumn, ElScrollbar, ElTree, ElIcon, ElMessage } from "../utils/components";
import { Refresh } from "@element-plus/icons-vue";
import { ref, reactive } from "vue";
import { send } from "@koishijs/client";
import type {} from "koishi-plugin-swbot-console/src/index";
import type { PlayerMeta } from "koishi-plugin-swbot/src/core";

import cloneDeep from 'lodash-es/cloneDeep';

export interface Page {
	name: string;
	id: string;
	title?: string;
	children?: Page[];
}

export interface Data {
	playerCount: number;
	playerAllPurse: number;
}

let pages: Page[] = [
	{name: "玩家", id: "player"},
	{name: "经济", id: "economy"}
];
let currentPage = ref <Page> (pages[0]);
let defaultData = {
	playerCount: 0,
	playerAllPurse: 0,
	playerList: []
};
let data = reactive <Data> (cloneDeep(defaultData));

async function loadData () {
	data = reactive (cloneDeep(defaultData));
	return [
		send("swbot/players/count").then(count => data.playerCount = count),
		send("swbot/players/purse/all").then(purse => data.playerAllPurse = purse),
	];
}

async function load () {
	await Promise.all(await loadData());
	ElMessage({type: "success", message: "数据已拉取！", duration: 1500, showClose: true});
}

load();

</script>


<style lang="scss" scoped>
.swbot-card {
	margin: var(--card-margin);
}
</style>
