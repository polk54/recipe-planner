import React, { useState } from 'react';
import { PlusCircle, MinusCircle, Clock, ExternalLink } from 'lucide-react';

const RecipeInputForm = () => {
  const [recipeUrls, setRecipeUrls] = useState(['']);
  const [timeline, setTimeline] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const addRecipeInput = () => {
    if (recipeUrls.length < 5) {
      setRecipeUrls([...recipeUrls, '']);
    }
  };

  const removeRecipeInput = (index) => {
    const newUrls = recipeUrls.filter((_, i) => i !== index);
    setRecipeUrls(newUrls);
  };

  const handleRecipeUrlChange = (index, value) => {
    const newUrls = [...recipeUrls];
    newUrls[index] = value;
    setRecipeUrls(newUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/plan-meal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipeUrls, timeline }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setResult({ error: 'An error occurred while planning the meal' });
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">Recipe Planner</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {recipeUrls.map((url, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="url"
                value={url}
                onChange={(e) => handleRecipeUrlChange(index, e.target.value)}
                placeholder="Enter recipe URL"
                className="flex-grow p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
              <button
                type="button"
                onClick={() => removeRecipeInput(index)}
                className="p-2 text-red-500 hover:text-red-700"
                aria-label="Remove recipe"
              >
                <MinusCircle size={24} />
              </button>
            </div>
          ))}
        </div>
        {recipeUrls.length < 5 && (
          <button
            type="button"
            onClick={addRecipeInput}
            className="w-full p-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition duration-300 flex items-center justify-center"
          >
            <PlusCircle size={20} className="mr-2" />
            Add Recipe ({5 - recipeUrls.length} remaining)
          </button>
        )}
        <div className="flex items-center space-x-2">
          <Clock size={24} className="text-indigo-500" />
          <input
            type="text"
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            placeholder="Enter cooking timeline (e.g., 'for dinner tonight')"
            className="flex-grow p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full p-3 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300 flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            'Planning...'
          ) : (
            <>
              <ExternalLink size={20} className="mr-2" />
              Plan My Meal
            </>
          )}
        </button>
      </form>
      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-semibold mb-2">Meal Plan Result:</h2>
          <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default RecipeInputForm;
