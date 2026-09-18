#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/dee2f07e302f394ef2f1298c3d6374359b08ba3e9182421986c87145fe9898d4/contract';
import endContract from '../../snapshots/dee2f07e302f394ef2f1298c3d6374359b08ba3e9182421986c87145fe9898d4/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/e2a5cb49f6e4403b54fbc9a0cadc8576de5c261bac38e0dd9698403d221318ed/contract';
import startContract from '../../snapshots/e2a5cb49f6e4403b54fbc9a0cadc8576de5c261bac38e0dd9698403d221318ed/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'webhookEndpoint',
        column: col('isActive', 'bool', {
          notNull: true,
          default: lit(true),
          codecRef: { codecId: 'pg/bool@1' },
        }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
