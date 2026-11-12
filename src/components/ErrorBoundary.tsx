import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error("Report section failed to render:", error);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <p className="text-sm font-medium text-foreground">
            Some report data couldn't be displayed
          </p>
          <p className="text-xs text-muted-foreground mt-1 font-mono">
            This scan may contain data recorded by an older version of the app.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
