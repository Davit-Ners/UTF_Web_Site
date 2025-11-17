import styles from "./merchFilters.module.css";

type Props = {
    active: "all" | "apparel" | "music" | "accessories";
    onChange: (value: Props["active"]) => void;
    count: number;
};

const OPTIONS: { value: Props["active"]; label: string }[] = [
    { value: "all", label: "All" },
    { value: "apparel", label: "Apparel" },
    { value: "music", label: "Music & CDs" },
    { value: "accessories", label: "Accessories" },
];

export default function MerchFilters({ active, onChange, count }: Props) {
    return (
        <div className={styles.wrap}>
        <div className={styles.tabs}>
            {OPTIONS.map((opt) => (
            <button
                key={opt.value}
                type="button"
                className={
                opt.value === active
                    ? `${styles.tab} ${styles.tabActive}`
                    : styles.tab
                }
                onClick={() => onChange(opt.value)}
            >
                {opt.label}
            </button>
            ))}
        </div>
        <span className={styles.count}>{count} items</span>
        </div>
    );
};
