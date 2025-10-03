/*
  Server-side script to log a random booking id once per invocation.
  Intended to be scheduled externally (e.g. cron, Windows Task Scheduler).
*/

const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const LOG_FILE = path.resolve(__dirname, '../logs/daily-random-booking.log');

function now() {
  return new Date().toISOString();
}

async function appendLog(line) {
  await fsPromises.mkdir(path.dirname(LOG_FILE), { recursive: true });
  await fsPromises.appendFile(LOG_FILE, line + '\n', 'utf8');
}

async function getRandomBookingId() {
  const total = await prisma.seaFreightBooking.count();
  if (total === 0) {
    return null;
  }

  const randomOffset = Math.floor(Math.random() * total);
  const booking = await prisma.seaFreightBooking.findFirst({
    select: { id: true },
    orderBy: { createdAt: 'asc' },
    skip: randomOffset,
    take: 1,
  });

  return booking ? booking.id : null;
}

async function main() {
  try {
    const bookingId = await getRandomBookingId();

    if (!bookingId) {
      const message = '[' + now() + '] No bookings available to sample.';
      console.warn(message);
      await appendLog(message);
      return;
    }

    const message = '[' + now() + '] Random booking id: ' + bookingId;
    console.log(message);
    await appendLog(message);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const message = '[' + now() + '] Failed to retrieve booking: ' + errorMessage;
    console.error(message);
    await appendLog(message);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
