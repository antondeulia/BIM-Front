export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  lastUpdated: string;
  content?: string;
  status?: string;
  tags?: string[];
  createdBy?: string;
  createdAt?: string;
}

export const projectsData: Project[] = [
  {
    id: "1",
    title: "Project Alpha",
    description:
      "A comprehensive data analysis project focusing on user behavior patterns and engagement metrics.",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    lastUpdated: "2024-01-15",
    content:
      "This project delves deep into analyzing user behavior patterns across multiple platforms. We've collected data from over 100,000 users and identified key engagement metrics that drive user retention. The analysis includes heat maps, click-through rates, and time-on-page metrics.",
    status: "Active",
    tags: ["Data Analysis", "User Behavior", "Analytics"],
    createdBy: "John Doe",
    createdAt: "2023-12-01",
  },
  {
    id: "2",
    title: "Project Beta",
    description:
      "Machine learning model for predictive analytics in customer retention strategies.",
    imageUrl:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop",
    lastUpdated: "2024-01-12",
    content:
      "Our machine learning model uses advanced algorithms to predict customer churn and retention. The model has been trained on historical data spanning 5 years and achieves 94% accuracy in predicting customer behavior. It uses features like purchase history, engagement scores, and support interactions.",
    status: "Active",
    tags: ["Machine Learning", "Predictive Analytics", "Customer Retention"],
    createdBy: "Jane Smith",
    createdAt: "2023-11-15",
  },
  {
    id: "3",
    title: "Project Gamma",
    description:
      "Data visualization dashboard for real-time monitoring of key performance indicators.",
    imageUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    lastUpdated: "2024-01-10",
    content:
      "This interactive dashboard provides real-time insights into business performance. It tracks over 50 KPIs including revenue, user growth, conversion rates, and customer satisfaction. The dashboard updates every minute and includes drill-down capabilities for detailed analysis.",
    status: "Active",
    tags: ["Dashboard", "Visualization", "Real-time"],
    createdBy: "Mike Johnson",
    createdAt: "2023-10-20",
  },
  {
    id: "4",
    title: "Project Delta",
    description:
      "Automated reporting system that generates insights from multiple data sources.",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    lastUpdated: "2024-01-08",
    content:
      "The automated reporting system consolidates data from 15 different sources including databases, APIs, and file systems. It generates comprehensive reports on a daily, weekly, and monthly basis, saving over 20 hours of manual work per week. Reports are automatically distributed to stakeholders via email.",
    status: "Active",
    tags: ["Automation", "Reporting", "Data Integration"],
    createdBy: "Sarah Williams",
    createdAt: "2023-09-10",
  },
  {
    id: "5",
    title: "Project Epsilon",
    description:
      "Data pipeline optimization project to improve processing speed and efficiency.",
    imageUrl:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop",
    lastUpdated: "2024-01-05",
    content:
      "This optimization project focused on improving our data processing pipeline. Through code refactoring, parallel processing, and caching strategies, we've reduced processing time by 75%. The pipeline now handles 10x more data volume while using 40% fewer resources.",
    status: "Completed",
    tags: ["Optimization", "Performance", "Data Pipeline"],
    createdBy: "David Brown",
    createdAt: "2023-08-05",
  },
];

export function getProjectById(id: string): Project | undefined {
  return projectsData.find((project) => project.id === id);
}

export function getAllProjects(): Project[] {
  return projectsData;
}
