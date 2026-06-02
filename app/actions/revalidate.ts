'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { clearMemoryCache } from '@/lib/cache';

const ALL_TAGS = [
  'latest-songs',
  'music-library',
  'all-albums',
  'all-artists',
  'song-data',
  'album-data',
  'artist-data',
  'site-settings'
];

export async function revalidatePublicData() {
  clearMemoryCache();
  for (const tag of ALL_TAGS) {
    try {
      revalidateTag(tag);
    } catch (e) {
      console.error(`Failed to revalidate tag ${tag}:`, e);
    }
  }
  revalidatePath('/', 'layout');
}

export async function revalidateSpecificData() {
  clearMemoryCache();
  for (const tag of ALL_TAGS) {
    try {
      revalidateTag(tag);
    } catch (e) {
      console.error(`Failed to revalidate tag ${tag}:`, e);
    }
  }
  revalidatePath('/', 'layout');
}

export async function revalidateSettings() {
  clearMemoryCache();
  for (const tag of ALL_TAGS) {
    try {
      revalidateTag(tag);
    } catch (e) {
      console.error(`Failed to revalidate tag ${tag}:`, e);
    }
  }
  revalidatePath('/', 'layout');
}

