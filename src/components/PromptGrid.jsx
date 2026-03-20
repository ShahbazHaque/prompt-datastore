import PromptCard from './PromptCard';

export default function PromptGrid({ prompts, onEdit, onDelete }) {
  if (prompts.length === 0) {
    return (
      <div className="grid">
        <div className="empty-state">
          <h3>No prompts found</h3>
          <p>Try a different search term or category, or add a new prompt.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid">
      {prompts.map(prompt => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
