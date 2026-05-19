'use server';

import { revalidatePath } from 'next/cache';

export async function revalidatePublicData() {
  revalidatePath('/', 'layout');
}

export async function revalidateSpecificData() {
  revalidatePath('/', 'layout');
}

export async function revalidateSettings() {
  revalidatePath('/', 'layout');
}
