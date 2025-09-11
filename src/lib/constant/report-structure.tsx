export const TEMPLATE_WATERBOARD_COLUMNS: string[] = [
  "DC",
  "RC",
  "Payment Amount",
  "100%",
  "99-75%",
  "74-50%",
  "CTP",
  "P",
  "T",
  "Complaint",
  "Protest",
  "Not.Att",
  "Already DC",
  "Remarks",
];

// Aliases so existing Firestore option names still map to template slots
// Add / edit based on what you actually have stored.
const ALIASES: Record<string, string[]> = {
  "100%": ["payment100", "100% payment", "payment 100%", "100%" ],
  "99-75%": ["(99-75)%", "99-75 %", "payment80","80%"],
  "74-50%": ["(74-50)%", "74-50 %", "payment50" , "50%"],
  "P": ["house closed p", "permanently gate closed"],
  "T": ["house closed t", "temporarlly gate closed"],
  "Already DC": ["already dc", "already disconnected"],
  "Not.Att": ["not.att", "not attempted", "not att"],
};

const normalize = (s: string) =>
  s.trim().replace(/\s+/g, " ").toLowerCase();

function aliasTarget(norm: string): string | null {
  for (const [template, list] of Object.entries(ALIASES)) {
    if (list.map(normalize).includes(norm)) return template;
  }
  return null;
}

/**
 * Builds ordered columns:
 * - Start with the full template (so structure is stable)
 * - Mark which template items are actually present in fetched options (by exact or alias match)
 * - Append extra (non-template) options at the end (alphabetical)
 * - If you ONLY want to show columns that exist, set includeAllTemplate = false
 */
export function buildOrderedColumns(
  fetchedNames: string[],
  includeAllTemplate = false
): string[] {
  const normToOriginal = new Map<string, string>();
  fetchedNames.forEach(n => {
    const norm = normalize(n);
    if (!normToOriginal.has(norm)) normToOriginal.set(norm, n);
  });

  // Map fetched names to template via alias or direct match
  const presentTemplate = new Set<string>();
  for (const [norm, original] of normToOriginal.entries()) {
    const directTemplate = TEMPLATE_WATERBOARD_COLUMNS.find(
      t => normalize(t) === norm
    );
    if (directTemplate) {
      presentTemplate.add(directTemplate);
      continue;
    }
    const aliased = aliasTarget(norm);
    if (aliased) presentTemplate.add(aliased);
  }

  const orderedTemplate = includeAllTemplate
    ? [...TEMPLATE_WATERBOARD_COLUMNS]
    : TEMPLATE_WATERBOARD_COLUMNS.filter(t => presentTemplate.has(t));

  // Extras = fetched that are neither template nor alias-mapped
  const templateNorms = new Set(
    TEMPLATE_WATERBOARD_COLUMNS.map(t => normalize(t))
  );
  const aliasNorms = new Set(
    Object.values(ALIASES).flat().map(a => normalize(a))
  );

  const extras = fetchedNames
    .filter(n => {
      const norm = normalize(n);
      if (templateNorms.has(norm)) return false;
      if (aliasTarget(norm)) return false;
      if (aliasNorms.has(norm)) return false;
      return true;
    })
    .sort((a, b) => a.localeCompare(b));

  return [...orderedTemplate, ...extras];
}