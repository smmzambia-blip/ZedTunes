'use server';

import { revalidateTag } from 'next/cache';

export async function revalidatePublicData() {
  revalidateTag('latest-songs');
  revalidateTag('music-library');
  revalidateTag('all-albums');
  revalidateTag('all-artists');
  // Specific data might still be cached by slug, but revalidating these lists will help
  // Actually, unstable_cache tags are global if we use the same Tag name
}

export async function revalidateSpecificData(type: 'song' | 'artist' | 'album', slug?: string) {
  if (slug) {
     // If we use pattern based tags like `song-${slug}` we could be more precise
  }
  revalidateTag('latest-songs');
  revalidateTag('music-library');
  revalidateTag('all-albums');
  revalidateTag('all-artists');
  revalidateTag('song-data');
  revalidateTag('artist-data');
  revalidateTag('album-data');
}

export async function revalidateSettings() {
  revalidateTag('site-settings');
}
