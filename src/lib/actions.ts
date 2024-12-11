"use server";

import { insertPlayer } from '@/lib/data';
import { revalidatePath } from 'next/cache';
import { PlayerWithoutId } from "@/lib/definitons";

export const createPlayer = async (player: PlayerWithoutId) => {
  try {
    await insertPlayer(player)
    revalidatePath('/players')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to add player' }
  }
}