import {
  getTransactionHostToken,
  TransactionHost,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Inject } from '@nestjs/common';
import { PrismaService } from './prisma.service';

export type PrismaTransactionHost = TransactionHost<
  TransactionalAdapterPrisma<PrismaService>
>;

export const PRISMA_CONNECTION_NAME = 'PRISMA_CONNECTION';

/**
 * Injection token for the underlying PrismaService (raw client) used by the transactional adapter.
 */
export const PRISMA_INJECTION_TOKEN = Symbol('PRISMA_INJECTION_TOKEN');
/**
 * Injection token for the TransactionHost (manages transactions and provides .tx).
 * This corresponds to the default TransactionHost instance registered by ClsPluginTransactional.
 */
export const PRISMA_TRANSACTION_HOST_TOKEN = getTransactionHostToken(
  PRISMA_CONNECTION_NAME,
);

/**
 * Decorator to inject the Prisma TransactionHost, giving access to .tx and withTransaction().
 */
export const InjectPrisma = () => Inject(PRISMA_TRANSACTION_HOST_TOKEN);
