import styles from "./Suggestions.module.css";

export function BlocSuggestions({ suggestions }: { suggestions: string[] }) {
  return (
    <div className={styles.bloc}>
      {suggestions.length > 0 ? (
        <ul className={styles.liste}>
          {suggestions.map((texte) => (
            <li key={texte} className={styles.item}>
              💡 {texte}
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.neutre}>Rien à te suggérer pour l&apos;instant, profite de ton rythme 🌿</div>
      )}
    </div>
  );
}
