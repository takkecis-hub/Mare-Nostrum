import { describe, expect, it } from 'vitest';
import portsJson from '../../../data/ports.json';
import routesJson from '../../../data/routes.json';
import goodsJson from '../../../data/goods.json';
import portGeoJson from '../../../data/port-geo.json';
import whispersJson from '../../../data/whispers.json';
import triviaJson from '../../../data/trivia.json';
import groundingManifestJson from '../../../data/grounding-manifest.json';
import provenanceJson from '../../../data/provenance.json';
import {
  collectGroundedDataIntegrityErrors,
  parseGoods,
  parseGroundingManifest,
  parsePortGeoMap,
  parsePorts,
  parseProvenanceCatalog,
  parseRoutes,
  parseTriviaCatalog,
  parseWhisperPool,
} from '../../shared/src/validators/index.js';

describe('grounded data integrity', () => {
  it('keeps structured data internally consistent', () => {
    const errors = collectGroundedDataIntegrityErrors({
      ports: parsePorts(portsJson),
      routes: parseRoutes(routesJson),
      goods: parseGoods(goodsJson),
      portGeo: parsePortGeoMap(portGeoJson),
      whisperPool: parseWhisperPool(whispersJson),
      triviaCatalog: parseTriviaCatalog(triviaJson),
      groundingManifest: parseGroundingManifest(groundingManifestJson),
      provenanceCatalog: parseProvenanceCatalog(provenanceJson),
    });

    expect(errors).toEqual([]);
  });
});
