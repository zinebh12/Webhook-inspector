#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/9df7215ba31c1938c791e13f9edd178cbc129815765053b0a45e8f18c5005e3d/contract';
import endContract from '../../snapshots/9df7215ba31c1938c791e13f9edd178cbc129815765053b0a45e8f18c5005e3d/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/dee2f07e302f394ef2f1298c3d6374359b08ba3e9182421986c87145fe9898d4/contract';
import startContract from '../../snapshots/dee2f07e302f394ef2f1298c3d6374359b08ba3e9182421986c87145fe9898d4/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'webhookRequest',
        column: col('ip', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
