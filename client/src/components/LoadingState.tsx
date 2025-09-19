interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading module content..." }: LoadingStateProps) {
  return (
    <div className="min-h-screen bg-theme-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-b2l-primary mx-auto mb-4"></div>
        <p className="text-theme-secondary">{message}</p>
      </div>
    </div>
  );
}
