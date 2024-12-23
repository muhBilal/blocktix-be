const prisma = require("../db/index");

const getAll = (filter) => {
  return prisma.events.findMany(filter);
};

const getById = (eventId) =>
  prisma.events.findFirst({
    where: {
      id: eventId,
    },
  });

const getDetail = async (eventId) => {
  try {
    const res = await prisma.events.findUnique({
      where: {
        id: Number(eventId),
      },
      include: {
        user_events: true,
        favorites: true,
        channels: true,
        tags: true,
      },
    });
    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const getSimilar = (currentEventId, eventTagId) =>
  prisma.events.findMany({
    take: 3,
    where: {
      OR: [{ tag_id: { equals: eventTagId } }],
      NOT: {
        id: { equals: currentEventId },
      },
    },
  });

const insert = (eventData) => {
  const { tag_id, channel_id, ...rest } = eventData;
  const res = prisma.events.create({
    data: {
      ...rest,
      tags: {
        connect: {
          id: tag_id,
        },
      },
      channels: {
        connect: {
          id: channel_id,
        },
      },
    },
  });

  return res;
};

// const updateById = (eventData, eventId) =>
//   prisma.events.update({
//     where: {
//       id: eventId,
//     },
//     data: {
//       ...eventData,
//     },
//   });
const updateById = (eventData, eventId) => {
  // Filter only valid fields for Prisma
  const validFields = {
    name: eventData.name,
    description: eventData.description,
    image: eventData.image,
    location: eventData.location,
    price: eventData.price,
    event_date: eventData.event_date,
    status: eventData.status,
    capacity: eventData.capacity,
  };

  // If tag_id is provided, use the connect operator to relate the tag
  if (eventData.tag_id) {
    validFields.tags = {
      connect: { id: eventData.tag_id } // Connecting to the tag by its id
    };
  }

  // Remove undefined properties
  const sanitizedFields = Object.fromEntries(
    Object.entries(validFields).filter(([, value]) => value !== undefined)
  );

  return prisma.events.update({
    where: {
      id: parseInt(eventId),
    },
    data: sanitizedFields,
  });
};



const updatePaymentImage = async (eventId, paymentImage) => {
  await prisma.events.update({
    where: {
      id: eventId,
    },
    data: {
      tf_image: paymentImage,
    },
  });
};

module.exports = {
  getAll,
  updateById,
  insert,
  getById,
  getDetail,
  getSimilar,
  updatePaymentImage,
};
