export interface HomePageProps { }

export interface HeroSectionProps {
    title: string;
    subtitle: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText: string;
    onPrimaryClick?: () => void;
    onSecondaryClick?: () => void;
}

export interface FeatureCardProps {
    icon: string;
    title: string;
    description: string;
}

export interface StatsItemProps {
    value: string;
    label: string;
}
