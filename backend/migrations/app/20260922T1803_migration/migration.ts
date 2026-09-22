#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/9df7215ba31c1938c791e13f9edd178cbc129815765053b0a45e8f18c5005e3d/contract';
import startContract from '../../snapshots/9df7215ba31c1938c791e13f9edd178cbc129815765053b0a45e8f18c5005e3d/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/f418eb881fe838e820938297951701389c5112f8e301a3bdda2da86152cc263f/contract';
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';
import postgresAdapter from '@prisma/orm-postgres/adapter/runtime';
import { sql } from '@prisma/orm-postgres/builder/runtime';
import {
  createExecutionContext,
  createSqlExecutionStack,
} from '@prisma/orm-postgres/family-runtime';
import postgresTarget, { PostgresContractSerializer } from '@prisma/orm-postgres/target/runtime';
import endContractJson from '../../snapshots/f418eb881fe838e820938297951701389c5112f8e301a3bdda2da86152cc263f/contract.json' with { type: 'json' };
const endContract = new PostgresContractSerializer().deserializeContract<End>(endContractJson);

const stack = createSqlExecutionStack({
  target: postgresTarget,
  adapter: postgresAdapter,
});

const db = sql<End>({
  context: createExecutionContext({
    contract: endContract,
    stack,
  }),
  rawCodecInferer: stack.adapter.rawCodecInferer,
});
export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContractJson;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'webhookEndpoint',
        column: col('slug', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.dataTransform(endContract, 'backfill-webhookEndpoint-slug', {
        check: () =>
          db.public.webhookEndpoint
            .select('id')
            .where((f, fns) => fns.eq(f.slug, null))
            .limit(1),

        run: () =>
          db.public.webhookEndpoint
            .update((f) => ({
              slug: f.url,
            }))
            .where((f, fns) => fns.eq(f.slug, null)),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
