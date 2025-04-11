import React, { useState } from 'react';
import { Input, Button, Spinner, Alert, AlertIcon } from '@chakra-ui/react';

const FireCodeLookup = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchTerm) {
      setError('Please enter a search term');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      console.log('Searching for:', searchTerm);
      // Simulating an API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Success handling logic here
    } catch (err) {
      // Error handling logic here
      setError('Failed to fetch results');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="fire-code-lookup-container my-4 mx-auto w-full max-w-md">
      <Input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search Fire Code..."
        className="fire-code-lookup-input border p-2 rounded"
      />
      <Button
        onClick={handleSearch}
        className="fire-code-lookup-button mt-2 bg-blue-500 text-white rounded p-2 w-full"
        disabled={isLoading}
      >
        {isLoading ? <Spinner size="sm" /> : 'Search'}
      </Button>

      {error && (
        <Alert status="error" className="mt-2">
          <AlertIcon />
          {error}
        </Alert>
      )}
    </div>
  );
};

export default FireCodeLookup;
