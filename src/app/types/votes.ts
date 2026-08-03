/** A for/against count. "For" and "against" are deliberately neutral — the
 *  words on screen differ by surface (Aye/No on a bill, Approve/Annul on an
 *  instrument) and are passed in as labels rather than baked in here. */
export interface Tally {
  for: number;
  against: number;
}
