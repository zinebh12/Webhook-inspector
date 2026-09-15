#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/e2a5cb49f6e4403b54fbc9a0cadc8576de5c261bac38e0dd9698403d221318ed/contract';
import endContract from '../../snapshots/e2a5cb49f6e4403b54fbc9a0cadc8576de5c261bac38e0dd9698403d221318ed/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'user',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('password', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'webhookEndpoint',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('url', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'webhookRequest',
        columns: [
          col('body', 'json', { codecRef: { codecId: 'pg/json@1' } }),
          col('endpointId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('headers', 'json', { notNull: true, codecRef: { codecId: 'pg/json@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('method', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('query', 'json', { codecRef: { codecId: 'pg/json@1' } }),
          col('receivedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('statusCode', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'user',
        constraint: 'user_email_key',
        columns: ['email'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'webhookEndpoint',
        constraint: 'webhookEndpoint_url_key',
        columns: ['url'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'webhookEndpoint',
        index: 'webhookEndpoint_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'webhookRequest',
        index: 'webhookRequest_endpointId_idx_48273c15',
        columns: ['endpointId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'webhookRequest',
        index: 'webhookRequest_receivedAt_idx_9e532856',
        columns: ['receivedAt'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'webhookEndpoint',
        foreignKey: {
          name: 'webhookEndpoint_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'webhookRequest',
        foreignKey: {
          name: 'webhookRequest_endpointId_fkey',
          columns: ['endpointId'],
          references: { schema: 'public', table: 'webhookEndpoint', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
