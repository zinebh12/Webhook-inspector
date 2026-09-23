#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/262b8abc65d95b47fa25e4481e44dddc1e3d55f61b2b489d61333a5b4fac26a1/contract';
import startContract from '../../snapshots/262b8abc65d95b47fa25e4481e44dddc1e3d55f61b2b489d61333a5b4fac26a1/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/29a3e00155b527047280f9f322a30f11c513b3c0b11d2dedfe6086c104baaf1a/contract';
import endContract from '../../snapshots/29a3e00155b527047280f9f322a30f11c513b3c0b11d2dedfe6086c104baaf1a/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'replayAttempt',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('errorMessage', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('requestId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('responseBody', 'json', { codecRef: { codecId: 'pg/json@1' } }),
          col('responseTime', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('statusCode', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('success', 'bool', { notNull: true, codecRef: { codecId: 'pg/bool@1' } }),
          col('url', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createIndex({
        schema: 'public',
        table: 'replayAttempt',
        index: 'replayAttempt_requestId_idx_fd667f92',
        columns: ['requestId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'replayAttempt',
        foreignKey: {
          name: 'replayAttempt_requestId_fkey',
          columns: ['requestId'],
          references: { schema: 'public', table: 'webhookRequest', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
