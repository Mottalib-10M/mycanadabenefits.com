/** Aiguillage des calculateurs complets : une seule île React par page outil. */
import type { ToolId } from '../../lib/guide-types';
import type { L } from './kit';
import { CcbCalc, CgebCalc, CwbCalc, CppCalc, OasCalc, GisCalc, ClawbackCalc, RrifCalc, CdbCalc, OtbCalc, QcFaCalc, BcfbCalc, AcfbCalc, DatesCalc } from './Tools';

const MAP: Record<ToolId, (p: { lang?: L; methodHref?: string }) => JSX.Element> = {
  ccb: CcbCalc, cgeb: CgebCalc, cwb: CwbCalc, cpp: CppCalc, oas: OasCalc, gis: GisCalc, clawback: ClawbackCalc, rrif: RrifCalc,
  cdb: CdbCalc, otb: OtbCalc, qcfa: QcFaCalc, bcfb: BcfbCalc, acfb: AcfbCalc, dates: DatesCalc,
};
export default function ToolSwitch({ tool, lang = 'en', methodHref }: { tool: ToolId; lang?: L; methodHref?: string }) {
  const C = MAP[tool];
  return <C lang={lang} methodHref={methodHref} />;
}
