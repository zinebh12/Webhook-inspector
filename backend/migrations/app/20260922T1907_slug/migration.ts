#!/usr/bin/env -S node

import type { Contract as End } from '../../snapshots/262b8abc65d95b47fa25e4481e44dddc1e3d55f61b2b489d61333a5b4fac26a1/contract';
import endContract from '../../snapshots/262b8abc65d95b47fa25e4481e44dddc1e3d55f61b2b489d61333a5b4fac26a1/contract.json' with { type: 'json' };

import type { Contract as Start } from '../../snapshots/f418eb881fe838e820938297951701389c5112f8e301a3bdda2da86152cc263f/contract';
import startContract from '../../snapshots/f418eb881fe838e820938297951701389c5112f8e301a3bdda2da86152cc263f/contract.json' with { type: 'json' };

import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;

  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropConstraint({
        schema: 'public',
        table: 'webhookEndpoint',
        constraint: 'webhookEndpoint_url_key',
      }),

      this.dropColumn({
        schema: 'public',
        table: 'webhookEndpoint',
        column: 'url',
      }),

      this.setNotNull({
        schema: 'public',
        table: 'webhookEndpoint',
        column: 'slug',
      }),

      this.addUnique({
        schema: 'public',
        table: 'webhookEndpoint',
        constraint: 'webhookEndpoint_slug_key',
        columns: ['slug'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
