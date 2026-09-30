import type { Camera, Group } from "three";

export function loadRift(camera: Camera): Promise<{
	scene: Group;
	partCount: number;
	/** Timeline length in seconds (260 frames at 30 fps). */
	duration: number;
	/** Poses the rift at a timeline time in seconds. */
	update(time: number): void;
}>;
