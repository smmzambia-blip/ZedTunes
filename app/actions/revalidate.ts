'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

export async function revalidatePublicData() {
  revalidatePath('/', 'layout');
}

export async function revalidateSpecificData() {
  revalidatePath('/', 'layout');
}

export async function revalidateSettings() {
  revalidateTag('site-settings');
  revalidatePath('/', 'layout');
}
