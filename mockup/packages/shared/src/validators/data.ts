import type {
  Good,
  GoodCategory,
  GroundingAuthority,
  GroundingCategory,
  GroundingManifest,
  GroundingManifestFileEntry,
  GroundingHierarchyEntry,
  GroundingRisk,
  Port,
  PortGeoMap,
  PriceBand,
  ProvenanceCatalog,
  ProvenanceConfidence,
  ProvenanceDisposition,
  ProvenanceRecord,
  ProvenanceSource,
  ProvenanceSourceType,
  Region,
  Route,
  RouteType,
  TriviaCatalog,
  TriviaEntry,
  WhisperCategory,
  WhisperLine,
  WhisperPool,
} from '../types/index.js';
import {
  CHOKEPOINT_ELEVATED_ENCOUNTER_CHANCE,
  DESIGN_AUTHORITY_PATH,
  REQUIRED_WHISPER_CATEGORIES,
  STATIC_TRIVIA_MIN_LINES,
  STATIC_WHISPER_POOL_MIN_LINES,
} from '../constants/index.js';

const REGIONS = ['bati', 'orta', 'dogu', 'guney'] as const;
const GOOD_CATEGORIES = ['yemek', 'luks', 'savas'] as const;
const PRICE_BANDS = ['ucuz', 'normal', 'pahali'] as const;
const ROUTE_TYPES = ['tramontana', 'kabotaj', 'fortuna', 'uzun_kabotaj'] as const;
const WHISPER_CATEGORIES = ['economy', 'security', 'politics', 'social'] as const;
const GROUNDING_CATEGORIES = [
  'factual_world_data',
  'derived_game_data',
  'narrative_flavor',
  'implementation_logic',
  'documentation',
] as const;
const GROUNDING_RISKS = ['high', 'medium', 'low'] as const;
const GROUNDING_AUTHORITIES = ['design', 'implementation', 'secondary'] as const;
const PROVENANCE_SOURCE_TYPES = [
  'design_doc',
  'implementation_data',
  'derived_from_game_data',
  'manual_audit',
] as const;
const PROVENANCE_CONFIDENCE = ['high', 'medium', 'low'] as const;
const PROVENANCE_DISPOSITIONS = ['exact', 'inferred', 'fictionalized', 'pending_verification'] as const;

const REQUIRED_GROUNDED_FILES = [
  'mockup/data/ports.json',
  'mockup/data/routes.json',
  'mockup/data/goods.json',
  'mockup/data/port-geo.json',
  'mockup/data/coastlines.json',
  'mockup/data/whispers.json',
  'mockup/data/trivia.json',
  'mockup/data/provenance.json',
  'mockup/data/grounding-manifest.json',
  'docs/data-grounding/README.md',
  'docs/data-grounding/file-audit-matrix.md',
  'docs/data-grounding/contradiction-register.md',
  'docs/data-grounding/provenance-ledger.md',
  'docs/data-grounding/remediation-backlog.md',
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function expectRecord(value: unknown, path: string): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new Error(`${path} must be an object`);
  }
  return value;
}

function expectArray(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) {
    throw new Error(`${path} must be an array`);
  }
  return value;
}

function expectString(value: unknown, path: string): string {
  if (typeof value !== 'string') {
    throw new Error(`${path} must be a string`);
  }
  return value;
}

function expectNumber(value: unknown, path: string): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error(`${path} must be a number`);
  }
  return value;
}

function expectStringArray(value: unknown, path: string): string[] {
  return expectArray(value, path).map((item, index) => expectString(item, `${path}[${index}]`));
}

function expectEnumValue<T extends readonly string[]>(value: unknown, path: string, options: T): T[number] {
  const result = expectString(value, path);
  if (!options.includes(result)) {
    throw new Error(`${path} must be one of ${options.join(', ')}`);
  }
  return result;
}

function parsePortTradeSlot(value: unknown, path: string): Port['produces'] {
  const record = expectRecord(value, path);
  return {
    good: expectString(record.good, `${path}.good`),
    category: expectEnumValue(record.category, `${path}.category`, GOOD_CATEGORIES) as GoodCategory,
    basePrice: expectEnumValue(record.basePrice, `${path}.basePrice`, PRICE_BANDS) as PriceBand,
  };
}

function parseWhisperLine(value: unknown, path: string): WhisperLine {
  const record = expectRecord(value, path);
  return {
    id: expectString(record.id, `${path}.id`),
    category: expectEnumValue(record.category, `${path}.category`, WHISPER_CATEGORIES) as WhisperCategory,
    text: expectString(record.text, `${path}.text`),
    provenanceRef: expectString(record.provenanceRef, `${path}.provenanceRef`),
  };
}

function parseTriviaEntry(value: unknown, path: string): TriviaEntry {
  const record = expectRecord(value, path);
  return {
    id: expectString(record.id, `${path}.id`),
    portId: expectString(record.portId, `${path}.portId`),
    text: expectString(record.text, `${path}.text`),
    provenanceRef: expectString(record.provenanceRef, `${path}.provenanceRef`),
  };
}

function parseGroundingHierarchyEntry(value: unknown, path: string): GroundingHierarchyEntry {
  const record = expectRecord(value, path);
  return {
    tier: expectNumber(record.tier, `${path}.tier`),
    path: expectString(record.path, `${path}.path`),
    role: expectString(record.role, `${path}.role`),
  };
}

function parseGroundingManifestFileEntry(value: unknown, path: string): GroundingManifestFileEntry {
  const record = expectRecord(value, path);
  return {
    path: expectString(record.path, `${path}.path`),
    category: expectEnumValue(record.category, `${path}.category`, GROUNDING_CATEGORIES) as GroundingCategory,
    risk: expectEnumValue(record.risk, `${path}.risk`, GROUNDING_RISKS) as GroundingRisk,
    authority: expectEnumValue(
      record.authority,
      `${path}.authority`,
      GROUNDING_AUTHORITIES,
    ) as GroundingAuthority,
    notes: expectString(record.notes, `${path}.notes`),
  };
}

function parseProvenanceSource(value: unknown, path: string): ProvenanceSource {
  const record = expectRecord(value, path);
  return {
    type: expectEnumValue(record.type, `${path}.type`, PROVENANCE_SOURCE_TYPES) as ProvenanceSourceType,
    title: expectString(record.title, `${path}.title`),
    locator: expectString(record.locator, `${path}.locator`),
    periodCovered: expectString(record.periodCovered, `${path}.periodCovered`),
    confidence: expectEnumValue(
      record.confidence,
      `${path}.confidence`,
      PROVENANCE_CONFIDENCE,
    ) as ProvenanceConfidence,
    disposition: expectEnumValue(
      record.disposition,
      `${path}.disposition`,
      PROVENANCE_DISPOSITIONS,
    ) as ProvenanceDisposition,
  };
}

function parseProvenanceRecord(value: unknown, path: string): ProvenanceRecord {
  const record = expectRecord(value, path);
  return {
    id: expectString(record.id, `${path}.id`),
    subjectPath: expectString(record.subjectPath, `${path}.subjectPath`),
    category: expectEnumValue(record.category, `${path}.category`, GROUNDING_CATEGORIES) as GroundingCategory,
    summary: expectString(record.summary, `${path}.summary`),
    sources: expectArray(record.sources, `${path}.sources`).map((source, index) =>
      parseProvenanceSource(source, `${path}.sources[${index}]`),
    ),
    notes: expectString(record.notes, `${path}.notes`),
  };
}

export function parsePorts(data: unknown): Port[] {
  return expectArray(data, 'ports').map((item, index) => {
    const record = expectRecord(item, `ports[${index}]`);
    return {
      id: expectString(record.id, `ports[${index}].id`),
      name: expectString(record.name, `ports[${index}].name`),
      displayName: expectString(record.displayName, `ports[${index}].displayName`),
      region: expectEnumValue(record.region, `ports[${index}].region`, REGIONS) as Region,
      controller: expectString(record.controller, `ports[${index}].controller`),
      produces: parsePortTradeSlot(record.produces, `ports[${index}].produces`),
      desires: parsePortTradeSlot(record.desires, `ports[${index}].desires`),
      special: expectStringArray(record.special, `ports[${index}].special`),
      trivia: expectStringArray(record.trivia, `ports[${index}].trivia`),
      x: expectNumber(record.x, `ports[${index}].x`),
      y: expectNumber(record.y, `ports[${index}].y`),
      lat: record.lat === undefined ? undefined : expectNumber(record.lat, `ports[${index}].lat`),
      lon: record.lon === undefined ? undefined : expectNumber(record.lon, `ports[${index}].lon`),
    };
  });
}

export function parseRoutes(data: unknown): Route[] {
  return expectArray(data, 'routes').map((item, index) => {
    const record = expectRecord(item, `routes[${index}]`);
    const chokepointValue = record.isChokepoint;
    return {
      id: expectString(record.id, `routes[${index}].id`),
      from: expectString(record.from, `routes[${index}].from`),
      to: expectString(record.to, `routes[${index}].to`),
      type: expectEnumValue(record.type, `routes[${index}].type`, ROUTE_TYPES) as RouteType,
      isChokepoint:
        chokepointValue === null ? null : expectString(chokepointValue, `routes[${index}].isChokepoint`),
      encounterChance: expectNumber(record.encounterChance, `routes[${index}].encounterChance`),
      turnsRequired: expectNumber(record.turnsRequired, `routes[${index}].turnsRequired`),
    };
  });
}

export function parseGoods(data: unknown): Good[] {
  return expectArray(data, 'goods').map((item, index) => {
    const record = expectRecord(item, `goods[${index}]`);
    return {
      id: expectString(record.id, `goods[${index}].id`),
      name: expectString(record.name, `goods[${index}].name`),
      category: expectEnumValue(record.category, `goods[${index}].category`, GOOD_CATEGORIES) as GoodCategory,
      originPort: expectString(record.originPort, `goods[${index}].originPort`),
      priceIndicator: expectNumber(record.priceIndicator, `goods[${index}].priceIndicator`),
    };
  });
}

export function parsePortGeoMap(data: unknown): PortGeoMap {
  const record = expectRecord(data, 'portGeo');
  return Object.fromEntries(
    Object.entries(record).map(([portId, value]) => {
      const entry = expectRecord(value, `portGeo.${portId}`);
      return [
        portId,
        {
          lat: expectNumber(entry.lat, `portGeo.${portId}.lat`),
          lon: expectNumber(entry.lon, `portGeo.${portId}.lon`),
        },
      ];
    }),
  );
}

export function parseWhisperPool(data: unknown): WhisperPool {
  const record = expectRecord(data, 'whisperPool');
  return Object.fromEntries(
    Object.entries(record).map(([portId, value]) => [
      portId,
      expectArray(value, `whisperPool.${portId}`).map((line, index) =>
        parseWhisperLine(line, `whisperPool.${portId}[${index}]`),
      ),
    ]),
  );
}

export function parseTriviaCatalog(data: unknown): TriviaCatalog {
  const record = expectRecord(data, 'triviaCatalog');
  return Object.fromEntries(
    Object.entries(record).map(([portId, value]) => [
      portId,
      expectArray(value, `triviaCatalog.${portId}`).map((item, index) =>
        parseTriviaEntry(item, `triviaCatalog.${portId}[${index}]`),
      ),
    ]),
  );
}

export function parseGroundingManifest(data: unknown): GroundingManifest {
  const record = expectRecord(data, 'groundingManifest');
  return {
    schemaVersion: expectNumber(record.schemaVersion, 'groundingManifest.schemaVersion'),
    sourceHierarchy: expectArray(record.sourceHierarchy, 'groundingManifest.sourceHierarchy').map((entry, index) =>
      parseGroundingHierarchyEntry(entry, `groundingManifest.sourceHierarchy[${index}]`),
    ),
    fileDeclarations: expectArray(record.fileDeclarations, 'groundingManifest.fileDeclarations').map(
      (entry, index) => parseGroundingManifestFileEntry(entry, `groundingManifest.fileDeclarations[${index}]`),
    ),
  };
}

export function parseProvenanceCatalog(data: unknown): ProvenanceCatalog {
  const record = expectRecord(data, 'provenanceCatalog');
  const records = expectRecord(record.records, 'provenanceCatalog.records');
  return {
    schemaVersion: expectNumber(record.schemaVersion, 'provenanceCatalog.schemaVersion'),
    records: Object.fromEntries(
      Object.entries(records).map(([id, value]) => [id, parseProvenanceRecord(value, `provenanceCatalog.records.${id}`)]),
    ),
  };
}

function findPortDesireCount(ports: Port[], goodId: string): number {
  return ports.filter((port) => port.desires.good === goodId).length;
}

export function collectGroundedDataIntegrityErrors(input: {
  ports: Port[];
  routes: Route[];
  goods: Good[];
  portGeo: PortGeoMap;
  whisperPool: WhisperPool;
  triviaCatalog: TriviaCatalog;
  groundingManifest: GroundingManifest;
  provenanceCatalog: ProvenanceCatalog;
}): string[] {
  const { ports, routes, goods, portGeo, whisperPool, triviaCatalog, groundingManifest, provenanceCatalog } = input;
  const errors: string[] = [];

  const portIds = new Set<string>();
  for (const port of ports) {
    if (portIds.has(port.id)) {
      errors.push(`Duplicate port id: ${port.id}`);
    }
    portIds.add(port.id);
  }

  const goodIds = new Set<string>();
  for (const good of goods) {
    if (goodIds.has(good.id)) {
      errors.push(`Duplicate good id: ${good.id}`);
    }
    goodIds.add(good.id);
  }

  const routeIds = new Set<string>();
  for (const route of routes) {
    if (routeIds.has(route.id)) {
      errors.push(`Duplicate route id: ${route.id}`);
    }
    routeIds.add(route.id);
    if (!portIds.has(route.from)) {
      errors.push(`Route ${route.id} references missing from port ${route.from}`);
    }
    if (!portIds.has(route.to)) {
      errors.push(`Route ${route.id} references missing to port ${route.to}`);
    }
    if (
      route.isChokepoint !== null &&
      route.encounterChance < CHOKEPOINT_ELEVATED_ENCOUNTER_CHANCE
    ) {
      errors.push(`Chokepoint route ${route.id} must have elevated encounterChance`);
    }
    if (route.isChokepoint !== null && route.isChokepoint.trim().length === 0) {
      errors.push(`Chokepoint route ${route.id} must define a non-empty chokepoint id`);
    }
  }

  for (const good of goods) {
    if (!portIds.has(good.originPort)) {
      errors.push(`Good ${good.id} references missing originPort ${good.originPort}`);
    }
  }

  for (const port of ports) {
    const producedGood = goods.find((good) => good.id === port.produces.good);
    const desiredGood = goods.find((good) => good.id === port.desires.good);
    if (!producedGood) {
      errors.push(`Port ${port.id} produces missing good ${port.produces.good}`);
    } else if (producedGood.category !== port.produces.category) {
      errors.push(`Port ${port.id} produce category mismatch for ${port.produces.good}`);
    }
    if (!desiredGood) {
      errors.push(`Port ${port.id} desires missing good ${port.desires.good}`);
    } else if (desiredGood.category !== port.desires.category) {
      errors.push(`Port ${port.id} desire category mismatch for ${port.desires.good}`);
    }
    if (port.lat !== undefined && port.lon !== undefined) {
      const geo = portGeo[port.id];
      if (!geo) {
        errors.push(`Port ${port.id} is missing port-geo entry`);
      } else if (geo.lat !== port.lat || geo.lon !== port.lon) {
        errors.push(`Port ${port.id} lat/lon differs between ports.json and port-geo.json`);
      }
    }
    if (findPortDesireCount(ports, port.produces.good) < 1) {
      errors.push(`Produced good ${port.produces.good} from ${port.id} has no destination demand`);
    }
  }

  for (const geoPortId of Object.keys(portGeo)) {
    if (!portIds.has(geoPortId)) {
      errors.push(`port-geo.json contains unknown port ${geoPortId}`);
    }
  }

  for (const port of ports) {
    const lines = whisperPool[port.id];
    if (!lines) {
      errors.push(`whispers.json is missing port ${port.id}`);
      continue;
    }
    if (lines.length < STATIC_WHISPER_POOL_MIN_LINES) {
      errors.push(
        `whispers.json port ${port.id} must contain at least ${STATIC_WHISPER_POOL_MIN_LINES} lines`,
      );
    }
    const categories = new Set(lines.map((line) => line.category));
    for (const category of REQUIRED_WHISPER_CATEGORIES) {
      if (!categories.has(category)) {
        errors.push(`whispers.json port ${port.id} is missing ${category} category`);
      }
    }
    for (const line of lines) {
      if (!provenanceCatalog.records[line.provenanceRef]) {
        errors.push(`Missing provenance record for whisper ${line.provenanceRef}`);
      }
    }
  }

  if (!whisperPool.default || whisperPool.default.length < STATIC_WHISPER_POOL_MIN_LINES) {
    errors.push(
      `whispers.json default pool must contain at least ${STATIC_WHISPER_POOL_MIN_LINES} lines`,
    );
  } else {
    for (const line of whisperPool.default) {
      if (!provenanceCatalog.records[line.provenanceRef]) {
        errors.push(`Missing provenance record for whisper ${line.provenanceRef}`);
      }
    }
  }

  for (const port of ports) {
    const entries = triviaCatalog[port.id];
    if (!entries) {
      errors.push(`trivia.json is missing port ${port.id}`);
      continue;
    }
    if (entries.length < STATIC_TRIVIA_MIN_LINES) {
      errors.push(`trivia.json port ${port.id} must contain at least ${STATIC_TRIVIA_MIN_LINES} entries`);
    }
    for (const entry of entries) {
      if (entry.portId !== port.id) {
        errors.push(`Trivia ${entry.id} portId mismatch (${entry.portId} !== ${port.id})`);
      }
      if (!provenanceCatalog.records[entry.provenanceRef]) {
        errors.push(`Missing provenance record for trivia ${entry.provenanceRef}`);
      }
    }
  }

  const declaredPaths = new Set(groundingManifest.fileDeclarations.map((entry) => entry.path));
  for (const requiredPath of REQUIRED_GROUNDED_FILES) {
    if (!declaredPaths.has(requiredPath)) {
      errors.push(`grounding-manifest.json is missing declaration for ${requiredPath}`);
    }
  }

  const hierarchyPaths = new Set(groundingManifest.sourceHierarchy.map((entry) => entry.path));
  if (!hierarchyPaths.has(DESIGN_AUTHORITY_PATH)) {
    errors.push(`grounding-manifest.json must declare ${DESIGN_AUTHORITY_PATH} as source hierarchy tier 1`);
  }

  for (const port of ports) {
    if (!provenanceCatalog.records[`port:${port.id}`]) {
      errors.push(`Missing provenance record for port:${port.id}`);
    }
  }
  for (const good of goods) {
    if (!provenanceCatalog.records[`good:${good.id}`]) {
      errors.push(`Missing provenance record for good:${good.id}`);
    }
  }
  for (const route of routes) {
    if (!provenanceCatalog.records[`route:${route.id}`]) {
      errors.push(`Missing provenance record for route:${route.id}`);
    }
  }

  return errors;
}

export function assertGroundedDataIntegrity(input: {
  ports: Port[];
  routes: Route[];
  goods: Good[];
  portGeo: PortGeoMap;
  whisperPool: WhisperPool;
  triviaCatalog: TriviaCatalog;
  groundingManifest: GroundingManifest;
  provenanceCatalog: ProvenanceCatalog;
}) {
  const errors = collectGroundedDataIntegrityErrors(input);
  if (errors.length > 0) {
    throw new Error(`Grounded data integrity validation failed:\n- ${errors.join('\n- ')}`);
  }
}
