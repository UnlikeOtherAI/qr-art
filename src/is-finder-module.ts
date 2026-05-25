export function isFinderModule(row: number, col: number, moduleCount: number): boolean {
  const inTop = row < 7;
  const inBottom = row >= moduleCount - 7;
  const inLeft = col < 7;
  const inRight = col >= moduleCount - 7;

  return (inTop && inLeft) || (inTop && inRight) || (inBottom && inLeft);
}
