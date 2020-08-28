<template>
	<swiper style="position: absolute;left: 0;right: 0;top: 0;bottom: 0;" :style="{height: screenHeight + 'px'}" :current="current" @change="change">
		<swiper-item>
			<slot name="left"></slot>
		</swiper-item>
		<swiper-item>
			<slot name="right"></slot>
		</swiper-item>
	</swiper>
</template>

<script>
	export default {
		props: {
			screenHeight: {
				default: 0
			},
			current: {
				default: 1
			}
		},
		data() {
			return {

			}
		},
		methods: {
			change: function(e) {
				this.$emit("change", e.detail.current)
			}
		}
	}
</script>

<style>

</style>
