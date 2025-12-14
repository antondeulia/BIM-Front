export default function SettingsPage() {
  return (
    <div className="data-page">
      <div className="data-page-header">
        <h1>Settings</h1>
      </div>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: 'calc(100vh - 200px)',
        color: 'var(--text-secondary)',
        fontSize: '18px'
      }}>
        In development
      </div>
    </div>
  );
}
