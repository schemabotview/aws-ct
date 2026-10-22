import type { Section } from '../types'

export const theCatalogBucket: Section = {
  id: 'the-catalog-bucket',
  title: 'The catalog bucket',
  scene: 'catalog-bucket',
  narration:
    "The buckets the scripts made in Course three are now declared, in templates slash storage dot yaml, shown on the right. The catalog bucket is named after the account, as before, and blocks all public access, so no policy or A C L can make it public by accident. The part shown is its bucket policy with one statement, H T T P S only: it denies every action, by anyone, on the bucket and everything in it, whenever the request did not arrive over T L S. That deny cannot be overridden by any allow. In the terminal, the storage stack is created, and the waiter returns when it is complete. Then the first product is put: its key is products slash p dash one thousand and one dot json, its content type J S O N, and S three returns its E tag. Getting it back returns the same length, one thousand eight hundred and thirty four bytes, the same type and the same E tag. Listing everything under the prefix products slash finds that one key. The list on the right is how S three names things, because it is easy to picture it as a file system and be surprised. A key is a flat name. The slash in products slash p dash one thousand and one is just a character; there is no products folder, only a prefix that listings and the console group by. A put replaces a whole object, so there is no appending to one or changing part of it. And every bucket the shop owns blocks public access, while the catalog's policy also refuses plain H T T P. This is the bucket the order A P I from Course six reads every product page from. Next, letting shoppers upload photos to S three without ever holding an A W S key.",
}
