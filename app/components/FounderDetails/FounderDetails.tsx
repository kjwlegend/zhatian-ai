import React from 'react';
import { Paper, Image, Text, Title } from '@mantine/core';
import { motion } from 'framer-motion';
import './FounderDetails.scss';

interface Founder {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
}

interface FounderDetailsProps {
  founder: Founder;
}

const FounderDetails: React.FC<FounderDetailsProps> = ({ founder }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      key={founder.id}
      className="founder-details"
    >
      <Paper shadow="md" p="xl" className="founder-paper">
        <div className="founder-content">
          <Image
            src={founder.image}
            alt={founder.name}
            height={400}
            fit="cover"
            className="founder-image"
          />
          <div className="founder-text">
            <Title order={2}>{founder.name}</Title>
            <Text size="lg" color="dimmed" mb="md">{founder.role}</Text>
            <Text>{founder.bio}</Text>
          </div>
        </div>
      </Paper>
    </motion.div>
  );
};

export default FounderDetails;
