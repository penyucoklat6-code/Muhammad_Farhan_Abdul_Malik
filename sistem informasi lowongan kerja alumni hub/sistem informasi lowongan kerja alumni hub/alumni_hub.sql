-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 18 Bulan Mei 2026 pada 16.51
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `alumni_hub`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `description`, `ip_address`, `created_at`, `updated_at`) VALUES
(1, 3, 'create_job', 'Membuat lowongan baru: asasa', '127.0.0.1', '2026-05-14 22:57:41', '2026-05-14 22:57:41'),
(2, NULL, 'review_job', 'Kaprodi memberikan review (approve) untuk lowongan: asasa', '127.0.0.1', '2026-05-14 23:00:02', '2026-05-14 23:00:02'),
(3, 9, 'create_job', 'Membuat lowongan baru: Backend Developer', '127.0.0.1', '2026-05-15 23:16:22', '2026-05-15 23:16:22'),
(4, 9, 'update_job', 'Memperbarui lowongan: Backend Developer', '127.0.0.1', '2026-05-15 23:17:56', '2026-05-15 23:17:56'),
(5, 9, 'update_job', 'Memperbarui lowongan: Backend Developer', '127.0.0.1', '2026-05-15 23:24:07', '2026-05-15 23:24:07'),
(6, 3, 'create_job', 'Membuat lowongan baru: full stack', '127.0.0.1', '2026-05-16 00:04:58', '2026-05-16 00:04:58'),
(7, 9, 'review_job', 'Kaprodi memberikan review (approve) untuk lowongan: full stack', '127.0.0.1', '2026-05-16 00:38:28', '2026-05-16 00:38:28'),
(8, 3, 'create_job', 'Membuat lowongan baru: full stack', '127.0.0.1', '2026-05-16 01:40:49', '2026-05-16 01:40:49'),
(9, 9, 'review_job', 'Kaprodi memberikan review (approve) untuk lowongan: full stack', '127.0.0.1', '2026-05-17 01:09:20', '2026-05-17 01:09:20'),
(10, 9, 'create_job', 'Membuat lowongan baru: semua diam', '127.0.0.1', '2026-05-17 01:27:40', '2026-05-17 01:27:40'),
(11, 3, 'create_job', 'Membuat lowongan baru: ffff', '127.0.0.1', '2026-05-17 01:29:33', '2026-05-17 01:29:33'),
(12, 9, 'review_job', 'Kaprodi memberikan review (approve) untuk lowongan: ffff', '127.0.0.1', '2026-05-17 01:30:00', '2026-05-17 01:30:00'),
(13, 3, 'create_job', 'Membuat lowongan baru: Data Analyst', '127.0.0.1', '2026-05-17 01:44:40', '2026-05-17 01:44:40'),
(14, 9, 'review_job', 'Kaprodi memberikan review (approve) untuk lowongan: Data Analyst', '127.0.0.1', '2026-05-17 01:50:02', '2026-05-17 01:50:02'),
(15, 3, 'apply_job', 'Melamar pada lowongan: Data Analyst (PT maju yok)', '127.0.0.1', '2026-05-17 02:40:17', '2026-05-17 02:40:17'),
(16, 9, 'update_application_status', 'Mengubah status lamaran Farhan ke \'interview\' pada lowongan: Data Analyst', '127.0.0.1', '2026-05-17 02:53:48', '2026-05-17 02:53:48'),
(17, 9, 'update_application_status', 'Mengubah status lamaran Farhan ke \'diterima\' pada lowongan: Data Analyst', '127.0.0.1', '2026-05-17 02:54:22', '2026-05-17 02:54:22'),
(18, 3, 'apply_job', 'Melamar pada lowongan: full stack (PT Digital Nusantara)', '127.0.0.1', '2026-05-17 05:24:57', '2026-05-17 05:24:57'),
(19, 9, 'update_application_status', 'Mengubah status lamaran Farhan ke \'interview\' pada lowongan: full stack', '127.0.0.1', '2026-05-17 05:37:38', '2026-05-17 05:37:38'),
(20, 9, 'update_application_status', 'Mengubah status lamaran Farhan ke \'ditolak\' pada lowongan: full stack', '127.0.0.1', '2026-05-17 05:44:18', '2026-05-17 05:44:18'),
(21, 3, 'create_job', 'Membuat lowongan baru: Data Engginer', '127.0.0.1', '2026-05-17 21:11:24', '2026-05-17 21:11:24'),
(22, 3, 'apply_job', 'Melamar pada lowongan: ffff (PT maju yok)', '127.0.0.1', '2026-05-17 21:17:31', '2026-05-17 21:17:31'),
(23, 9, 'create_job', 'Membuat lowongan baru: Game Developer', '127.0.0.1', '2026-05-17 21:53:54', '2026-05-17 21:53:54'),
(24, 9, 'review_job', 'Kaprodi memberikan review (approve) untuk lowongan: Data Engginer', '127.0.0.1', '2026-05-18 01:24:30', '2026-05-18 01:24:30');

-- --------------------------------------------------------

--
-- Struktur dari tabel `applications`
--

CREATE TABLE `applications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `job_id` bigint(20) UNSIGNED NOT NULL,
  `cv_path` varchar(255) NOT NULL,
  `portfolio_path` varchar(255) DEFAULT NULL,
  `status` enum('dikirim','interview','diproses','diterima','ditolak') DEFAULT 'dikirim',
  `applied_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `applications`
--

INSERT INTO `applications` (`id`, `user_id`, `job_id`, `cv_path`, `portfolio_path`, `status`, `applied_at`, `updated_at`) VALUES
(1, 3, 7, 'documents/3/RLVGii4a69CVwN89swt4RGPLKQ4WAoeFmE3KS5h5.pdf', NULL, 'diterima', '2026-05-17 02:40:04', '2026-05-17 02:54:16'),
(2, 3, 3, 'documents/3/RLVGii4a69CVwN89swt4RGPLKQ4WAoeFmE3KS5h5.pdf', NULL, 'ditolak', '2026-05-17 05:24:47', '2026-05-17 05:44:12'),
(3, 3, 6, 'documents/3/RLVGii4a69CVwN89swt4RGPLKQ4WAoeFmE3KS5h5.pdf', NULL, 'dikirim', '2026-05-17 21:17:18', NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `bookmarks`
--

CREATE TABLE `bookmarks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `job_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `bookmarks`
--

INSERT INTO `bookmarks` (`id`, `user_id`, `job_id`, `created_at`) VALUES
(3, 3, 2, '2026-05-17 12:46:48');

-- --------------------------------------------------------

--
-- Struktur dari tabel `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Teknologi Informasi (IT) & Software', NULL, '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(2, 'Pendidikan & Pelatihan', NULL, '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(3, 'Kesehatan & Medis', NULL, '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(4, 'Keuangan & Akuntansi', NULL, '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(5, 'Pemasaran & Public Relations', NULL, '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(6, 'Penjualan (Sales) & Pengembangan Bisnis', NULL, '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(7, 'Administrasi & Dukungan Kantor', NULL, '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(8, 'Sumber Daya Manusia (HRD)', NULL, '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(9, 'Teknik & Manufaktur', NULL, '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(10, 'Layanan Pelanggan (Customer Service)', NULL, '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(11, 'Desain & Kreatif', NULL, '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(12, 'Logistik & Supply Chain', NULL, '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(13, 'Hukum & Kepatuhan', NULL, '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(14, 'Media & Jurnalisme', NULL, '2026-05-14 22:56:11', '2026-05-14 22:56:11');

-- --------------------------------------------------------

--
-- Struktur dari tabel `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text NOT NULL,
  `requirements` text DEFAULT NULL,
  `company` varchar(150) NOT NULL,
  `location` varchar(150) NOT NULL,
  `type` varchar(50) NOT NULL,
  `work_arrangement` enum('WFO','WFH','Hybrid') NOT NULL DEFAULT 'WFO',
  `salary` varchar(100) DEFAULT NULL,
  `salary_min` decimal(15,0) DEFAULT NULL,
  `salary_max` decimal(15,0) DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `status` enum('pending','published','rejected','revision','closed') NOT NULL DEFAULT 'pending',
  `poster` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `link_apply` varchar(255) DEFAULT NULL,
  `external_link` varchar(255) DEFAULT NULL,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `major_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `jobs`
--

INSERT INTO `jobs` (`id`, `user_id`, `title`, `description`, `requirements`, `company`, `location`, `type`, `work_arrangement`, `salary`, `salary_min`, `salary_max`, `deadline`, `status`, `poster`, `logo`, `link_apply`, `external_link`, `category_id`, `major_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 3, 'asasa', 'assa', NULL, 'asasa', 'asas', 'full-time', 'WFO', NULL, NULL, NULL, '2026-11-06', 'published', 'jobs/posters/5kIi34zDHZwq72ndItqYQxZxfE8WEwLxE0XYgJwR.jpg', 'jobs/logos/4ERTFdF66dezg4K3ARLmYWo7qmS66MOabHFWASUH.jpg', NULL, NULL, 7, 3, '2026-05-14 22:57:41', '2026-05-14 23:00:02', NULL),
(2, 9, 'Backend Developer', 'Bertanggung jawab untuk pengembangan backend sistem', NULL, 'PT Digital Nusantara', 'Jakarta Timur', 'full-time', 'WFO', NULL, NULL, NULL, '2026-12-31', 'published', 'jobs/posters/sRNpl77w3PiFtOeMXSwAQz89uSuAuc2ZYBLS6VVj.jpg', 'jobs/logos/nccSb2FbV9pT0vIQLLugndkO5Zpa5M3eaMnFoQEV.jpg', NULL, NULL, 7, 16, '2026-05-15 23:16:22', '2026-05-15 23:24:07', NULL),
(3, 3, 'full stack', 'kfajfla', NULL, 'PT Digital Nusantara', 'Jakarta selatan', 'full-time', 'WFO', NULL, NULL, NULL, '2026-06-18', 'published', 'jobs/posters/GzlSSqtW8qnV1ORgg6HFEDnVxEJSlDmxaljIWNgb.jpg', 'jobs/logos/POqZR7rRn5NCzowY3BJ6eS6KjSe3KCMkouoByOPX.jpg', NULL, NULL, 14, 3, '2026-05-16 00:04:58', '2026-05-16 00:38:28', NULL),
(4, 3, 'full stack', 'ngooding sampe setresssss', NULL, 'PT Digital Nusantara', 'Jakarta selatan', 'internship', 'WFO', NULL, NULL, NULL, '2026-10-16', 'published', 'jobs/posters/1HyH5wxX3clEuSCMP2S4fTNMZWwC99Fv35SJ6nr2.jpg', 'jobs/logos/MYF5JqxDtfHV1msh9Fsq2kwdPDXOceS4kdKvtVec.jpg', NULL, NULL, 1, 8, '2026-05-16 01:40:49', '2026-05-17 01:09:20', NULL),
(5, 9, 'semua diam', 'asasasas', NULL, 'PT maju yok', 'jakarta timur', 'part-time', 'WFO', NULL, NULL, NULL, '2026-06-30', 'published', 'jobs/posters/f4cHbCCinLtT5xBwX8bUE0yd48B7hijmYo6W5Bmq.jpg', 'jobs/logos/kaqh02H2lmN58gB5ZLWIk22noA1ONuAKoLhlLAIa.jpg', NULL, NULL, 9, 22, '2026-05-17 01:27:40', '2026-05-17 01:27:40', NULL),
(6, 3, 'ffff', 'ererer', NULL, 'PT maju yok', 'ffff', 'contract', 'WFO', NULL, NULL, NULL, '2026-07-02', 'published', 'jobs/posters/cM1MH4ZHIXlYFzsiGhxuuBxRDn4WOBgpcm3KOQYH.jpg', 'jobs/logos/OLqJOzETlpfACk9RY05ELLpNBb1Dl8WGnxyjvSmv.jpg', NULL, NULL, 8, 10, '2026-05-17 01:29:33', '2026-05-17 01:30:00', NULL),
(7, 3, 'Data Analyst', 'Menganalisis data bisnis perusahaan', 'Mahir Python, SQL, dan Excel', 'PT maju yok', 'Bandung', 'full-time', 'WFO', NULL, 5000000, 10000000, '2026-12-31', 'published', NULL, NULL, NULL, NULL, 1, NULL, '2026-05-17 01:44:40', '2026-05-17 01:50:02', NULL),
(8, 3, 'Data Engginer', 'Melakukan pencarian data dengan metode Scraping, dan Crawling \r\nmembersihkan data yang diperoleh', 'Ptyhon, Anaconda, Google Colab', 'LUXIO_EDEMY', 'jakarta timur', 'internship', 'WFO', NULL, 5000000, 5999998, '2026-06-26', 'published', 'jobs/posters/ys0Qk6JAT1n3rxNdrYGo7qKycfAoYvOW79118vmW.jpg', 'jobs/logos/dGOpHb6wGAM92KtchGZOFbaigLnie8sHA2URGtYv.jpg', NULL, 'https://www.youtube.com/watch?v=sgBdAEoJS', 1, 18, '2026-05-17 21:11:24', '2026-05-18 01:24:30', NULL),
(9, 9, 'Game Developer', 'dapat mengoperasikan perangkat lunak', 'Bisa mengoperasikan Game maker', 'LUXIO_EDEMY', 'Jakarta selatan', 'internship', 'Hybrid', NULL, 8000000, 9000000, '2026-05-30', 'published', 'jobs/posters/NYszWYw4Au2hltJujkhIA9HGiKcO1jaVWGZhep5e.jpg', 'jobs/logos/Nt8Kx7IQiBKqZwreYOaZcMZDEC4OiPf6TLc3wH0F.jpg', NULL, 'https://www.youtube.com/watch?v=sgBdAEoS4Q', 1, 18, '2026-05-17 21:53:54', '2026-05-17 21:53:54', NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `job_reviews`
--

CREATE TABLE `job_reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `job_id` bigint(20) UNSIGNED NOT NULL,
  `kaprodi_id` bigint(20) UNSIGNED NOT NULL,
  `status` enum('approve','rejected','revision') NOT NULL,
  `reason` text DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `job_reviews`
--

INSERT INTO `job_reviews` (`id`, `job_id`, `kaprodi_id`, `status`, `reason`, `reviewed_at`, `created_at`, `updated_at`) VALUES
(2, 3, 9, 'approve', 'baguss', '2026-05-16 00:38:28', '2026-05-16 00:38:28', '2026-05-16 00:38:28'),
(3, 4, 9, 'approve', 'bagus sekali CV nya', '2026-05-17 01:09:20', '2026-05-17 01:09:20', '2026-05-17 01:09:20'),
(4, 6, 9, 'approve', 'ok', '2026-05-17 01:30:00', '2026-05-17 01:30:00', '2026-05-17 01:30:00'),
(5, 7, 9, 'approve', NULL, '2026-05-17 01:50:02', '2026-05-17 01:50:02', '2026-05-17 01:50:02'),
(6, 8, 9, 'approve', NULL, '2026-05-18 01:24:30', '2026-05-18 01:24:30', '2026-05-18 01:24:30');

-- --------------------------------------------------------

--
-- Struktur dari tabel `majors`
--

CREATE TABLE `majors` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `majors`
--

INSERT INTO `majors` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Pendidikan Guru SD (PGSD)', '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(2, 'Pendidikan Guru PAUD', '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(3, 'Bimbingan dan Konseling', '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(4, 'Pendidikan Bahasa dan Sastra Indonesia', '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(5, 'Pendidikan Bahasa Inggris', '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(6, 'Pendidikan Sejarah', '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(7, 'Pendidikan Geografi', '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(8, 'Pendidikan Ekonomi', '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(9, 'Pendidikan Fisika', '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(10, 'Pendidikan Biologi', '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(11, 'Pendidikan Bahasa Jepang', '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(12, 'Manajemen', '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(13, 'Akuntansi', '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(14, 'Ekonomi Islam', '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(15, 'Perpajakan', '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(16, 'Teknik Mesin', '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(17, 'Teknik Elektro', '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(18, 'Teknik Informatika', '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(19, 'Ilmu Kesehatan Masyarakat', '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(20, 'Gizi', '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(21, 'Teknik Kardiovaskuler', '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(22, 'Ilmu Komunikasi', '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(23, 'Farmasi', '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(24, 'Analis Kesehatan', '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(25, 'Pendidikan Agama Islam', '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(26, 'Perbankan Syariah', '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(27, 'Pendidikan Bahasa Arab', '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(28, 'Ilmu Kedokteran', '2026-05-14 22:56:11', '2026-05-14 22:56:11'),
(29, 'Psikologi', '2026-05-14 22:56:11', '2026-05-14 22:56:11');

-- --------------------------------------------------------

--
-- Struktur dari tabel `messages`
--

CREATE TABLE `messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `sender_id` bigint(20) UNSIGNED NOT NULL,
  `receiver_id` bigint(20) UNSIGNED NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `receiver_id`, `message`, `is_read`, `created_at`, `updated_at`) VALUES
(1, 9, 1, 'Halo Test Mahasiswa, apakah Anda sudah siap diwisuda?', 0, '2026-05-17 21:04:07', '2026-05-17 21:04:07'),
(2, 3, 9, 'mas, lowongan ini masih bisa di dibuka engga ya?', 1, '2026-05-17 21:09:01', '2026-05-17 21:12:05'),
(3, 9, 3, 'untuk lowongan tersebut sudah di tutup ya kak', 1, '2026-05-17 21:12:14', '2026-05-18 01:44:20'),
(4, 11, 3, 'hai', 1, '2026-05-18 01:43:58', '2026-05-18 01:44:25');

-- --------------------------------------------------------

--
-- Struktur dari tabel `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '2026_05_09_000001_create_otp_verifications_table', 1),
(4, '2026_05_09_000002_create_categories_table', 1),
(5, '2026_05_09_000003_create_majors_table', 1),
(6, '2026_05_09_000004_create_jobs_table', 1),
(7, '2026_05_09_000005_create_job_reviews_table', 1),
(8, '2026_05_09_000006_create_applications_table', 1),
(9, '2026_05_09_000007_create_notifications_table', 1),
(10, '2026_05_09_000008_create_bookmarks_table', 1),
(11, '2026_05_09_000009_create_recycle_bins_table', 1),
(12, '2026_05_14_000000_create_activity_logs_table', 1),
(13, '2026_05_15_000001_add_nim_to_users_table', 1),
(14, '2026_05_15_035616_create_personal_access_tokens_table', 2),
(15, '2026_05_15_041419_add_biodata_to_users_table', 3),
(19, '2026_05_15_041419_create_user_documents_table', 4),
(20, '2026_05_15_041420_create_user_languages_table', 4),
(21, '2026_05_15_053104_add_avatar_to_users_table', 5),
(22, '2026_05_16_092504_create_mitras_table', 6),
(23, '2026_05_16_093259_add_fakultas_jurusan_to_users_table', 7),
(24, '2026_05_17_083730_add_requirements_salary_fields_to_jobs_table', 8),
(25, '2026_05_17_093100_add_interview_status_to_applications', 9),
(26, '2026_05_17_120435_add_details_to_mitras_table', 10),
(27, '2026_05_18_000001_create_messages_table', 11),
(28, '2026_05_18_043900_add_work_arrangement_to_jobs_table', 12);

-- --------------------------------------------------------

--
-- Struktur dari tabel `mitras`
--

CREATE TABLE `mitras` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `established_date` date DEFAULT NULL,
  `address` text DEFAULT NULL,
  `website_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `mitras`
--

INSERT INTO `mitras` (`id`, `name`, `logo`, `description`, `established_date`, `address`, `website_url`, `created_at`, `updated_at`) VALUES
(1, 'PT maju yok', 'mitras/QXXoQ76ZIW8r8EdlzSdZRzzOmPSW2rEnHiNv0HNH.jpg', '111111', NULL, NULL, NULL, '2026-05-17 01:25:16', '2026-05-17 01:25:16'),
(2, 'LUXIO_EDEMY', 'mitras/48yfgKw8bG4ZkgrY9ozFVnfFPB10VUbaxUveeI3P.jpg', 'fhaskfjhsf', '2026-07-02', 'Jl. Raya Jakarta-Bogor No.KM.23 No.99, RT.4/RW.5, Rambutan, Kec. Ciracas, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13830', 'https://koko', '2026-05-17 05:27:55', '2026-05-18 01:10:55'),
(3, 'PT Bank Mandiri', 'mitras/jSALDj9n2NKZxzrVQcHrD0AoofpPIUJYYWs48eiB.png', 'Tumbuh Bersama, untuk Indonesia\r\nDi Bank Mandiri, karier bukan sekadar pekerjaan. Karier adalah ruang untuk bertumbuh, berkontribusi, dan mengambil peran dalam menghadirkan solusi finansial terbaik bagi Indonesia.\r\n\r\nSebagai institusi keuangan terbesar dan terpercaya di tanah air, Bank Mandiri terus memperkuat perannya sebagai mitra finansial pilihan utama bagi nasabah, masyarakat, dunia usaha, dan seluruh pemangku kepentingan. Dengan fondasi bisnis yang kokoh, tata kelola yang kuat, serta transformasi digital yang berkelanjutan, kami membuka ruang bagi setiap talenta untuk berkembang, berinovasi, dan memberikan dampak nyata dalam skala nasional.\r\n\r\nKami percaya bahwa sumber daya manusia yang unggul merupakan penggerak utama keberlanjutan bisnis dan kontribusi Bank Mandiri bagi negeri. Karena itu, kami selalu memastikan lingkungan kerja yang inklusif, progresif serta menjadi kontributor pertumbuhan yang berkesinambungan; didukung oleh program pengembangan terarah, exposure lintas fungsi, jalur karier yang transparan, serta kesempatan untuk belajar dari para pemimpin dan praktisi terbaik di industri keuangan.\r\n\r\nSpirit Memakmurkan Negeri sebagai Noble Purpose, setiap Mandirian didorong untuk tidak hanya mencapai kinerja terbaik, tetapi juga menciptakan nilai berkelanjutan bagi nasabah, perusahaan, masyarakat, dan Indonesia. Di Mandiri, setiap ide, kontribusi, dan pencapaian menjadi bagian dari perjalanan besar untuk membangun masa depan yang lebih baik.\r\n\r\n \r\n\r\nSeluruh Mandirian bekerja dibentuk oleh karakter agility dan way of working Mandirian DNA (M-DNA) dengan karakteristik sebagai berikut:\r\n\r\n· Think Big & Deliver Beyond Expectation\r\n\r\n· Start from The End\r\n\r\n· Create Our Own Game\r\n\r\n· Fast, Detail & Don’t Want to Fail\r\n\r\n· Go to Z\r\n\r\nMari tumbuh bersama Mandiri dan menjadi bagian dari perjalanan membangun institusi keuangan terbaik di Asia Tenggara. Baik Anda seorang fresh graduate, pencari kesempatan magang, maupun profesional berpengalaman, temukan peran yang selaras dengan aspirasi, kompetensi, dan ambisi Anda.\r\n\r\nBergabunglah bersama Bank Mandiri, bangun karier Anda dan tumbuh Bersama, untuk Indonesia.', '2026-05-18', 'Menara Mandiri 1\r\nJalan Jenderal Sudirman Kav 54-55\r\nJakarta 12190 Indonesia\r\nTelp: 14000, +62-21-52997777\r\nEmail: mandiricare@bankmandiri.co.id\r\nSWIFT Code: BMRIIDJA', 'https://www.bankmandiri.co.id/', '2026-05-18 01:05:54', '2026-05-18 01:05:54');

-- --------------------------------------------------------

--
-- Struktur dari tabel `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(150) NOT NULL,
  `message` text NOT NULL,
  `type` enum('in_app','email') NOT NULL DEFAULT 'in_app',
  `is_read` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `type`, `is_read`, `created_at`) VALUES
(1, 3, 'Lowongan Dikirim untuk Review', 'Lowongan \"asasa\" berhasil dikirim dan sedang menunggu persetujuan Kaprodi.', 'in_app', 0, '2026-05-15 05:57:41'),
(2, 3, 'Status Lowongan Diperbarui', 'Lowongan \"asasa\" Anda telah disetujui ✅. Catatan: sangat bagus', 'in_app', 0, '2026-05-15 06:00:02'),
(3, 3, 'Email Notifikasi: Status Lowongan', 'Lowongan \"asasa\" Anda telah disetujui ✅. Catatan: sangat bagus', 'email', 0, '2026-05-15 06:00:02'),
(4, 9, 'Lowongan Dikirim untuk Review', 'Lowongan \"Backend Developer\" berhasil dikirim dan sedang menunggu persetujuan Kaprodi.', 'in_app', 0, '2026-05-16 06:16:22'),
(5, 3, 'Lowongan Dikirim untuk Review', 'Lowongan \"full stack\" berhasil dikirim dan sedang menunggu persetujuan Kaprodi.', 'in_app', 0, '2026-05-16 07:04:58'),
(6, 9, 'Lowongan Baru Menunggu Review', 'Ada lowongan baru \"full stack\" dari reja z yang perlu direview.', 'in_app', 0, '2026-05-16 07:04:58'),
(7, 10, 'Lowongan Baru Menunggu Review', 'Ada lowongan baru \"full stack\" dari reja z yang perlu direview.', 'in_app', 0, '2026-05-16 07:04:58'),
(8, 3, 'Status Lowongan Diperbarui', 'Lowongan \"full stack\" Anda telah disetujui ✅. Catatan: baguss', 'in_app', 0, '2026-05-16 07:38:28'),
(9, 3, 'Email Notifikasi: Status Lowongan', 'Lowongan \"full stack\" Anda telah disetujui ✅. Catatan: baguss', 'email', 0, '2026-05-16 07:38:28'),
(10, 3, 'Lowongan Dikirim untuk Review', 'Lowongan \"full stack\" berhasil dikirim dan sedang menunggu persetujuan Kaprodi.', 'in_app', 0, '2026-05-16 08:40:49'),
(11, 9, 'Lowongan Baru Menunggu Review', 'Ada lowongan baru \"full stack\" dari reja z yang perlu direview.', 'in_app', 0, '2026-05-16 08:40:49'),
(12, 10, 'Lowongan Baru Menunggu Review', 'Ada lowongan baru \"full stack\" dari reja z yang perlu direview.', 'in_app', 0, '2026-05-16 08:40:49'),
(13, 3, 'Status Lowongan Diperbarui', 'Lowongan \"full stack\" Anda telah disetujui ✅. Catatan: bagus sekali CV nya', 'in_app', 0, '2026-05-17 08:09:20'),
(14, 3, 'Email Notifikasi: Status Lowongan', 'Lowongan \"full stack\" Anda telah disetujui ✅. Catatan: bagus sekali CV nya', 'email', 0, '2026-05-17 08:09:20'),
(15, 9, 'Lowongan Dikirim untuk Review', 'Lowongan \"semua diam\" berhasil dikirim dan sedang menunggu persetujuan Kaprodi.', 'in_app', 0, '2026-05-17 08:27:40'),
(16, 3, 'Lowongan Dikirim untuk Review', 'Lowongan \"ffff\" berhasil dikirim dan sedang menunggu persetujuan Kaprodi.', 'in_app', 0, '2026-05-17 08:29:33'),
(17, 9, 'Lowongan Baru Menunggu Review', 'Ada lowongan baru \"ffff\" dari Farhan yang perlu direview.', 'in_app', 0, '2026-05-17 08:29:33'),
(18, 10, 'Lowongan Baru Menunggu Review', 'Ada lowongan baru \"ffff\" dari Farhan yang perlu direview.', 'in_app', 0, '2026-05-17 08:29:33'),
(19, 3, 'Status Lowongan Diperbarui', 'Lowongan \"ffff\" Anda telah disetujui ✅. Catatan: ok', 'in_app', 0, '2026-05-17 08:30:00'),
(20, 3, 'Email Notifikasi: Status Lowongan', 'Lowongan \"ffff\" Anda telah disetujui ✅. Catatan: ok', 'email', 0, '2026-05-17 08:30:00'),
(21, 3, 'Lowongan Dikirim untuk Review', 'Lowongan \"Data Analyst\" berhasil dikirim dan sedang menunggu persetujuan Kaprodi.', 'in_app', 0, '2026-05-17 08:44:40'),
(22, 9, 'Lowongan Baru Menunggu Review', 'Ada lowongan baru \"Data Analyst\" dari Farhan yang perlu direview.', 'in_app', 0, '2026-05-17 08:44:40'),
(23, 10, 'Lowongan Baru Menunggu Review', 'Ada lowongan baru \"Data Analyst\" dari Farhan yang perlu direview.', 'in_app', 0, '2026-05-17 08:44:40'),
(24, 3, 'Status Lowongan Diperbarui', 'Lowongan \"Data Analyst\" Anda telah disetujui ✅.', 'in_app', 0, '2026-05-17 08:50:02'),
(25, 3, 'Email Notifikasi: Status Lowongan', 'Lowongan \"Data Analyst\" Anda telah disetujui ✅.', 'email', 0, '2026-05-17 08:50:02'),
(26, 3, 'Lamaran Berhasil Dikirim ✅', 'Lamaran Anda pada \"Data Analyst\" di PT maju yok berhasil dikirim. Pantau status lamaran Anda di halaman Lamaran Saya.', 'in_app', 0, '2026-05-17 09:40:04'),
(27, 3, 'Email: Lamaran Berhasil', 'Lamaran pada \"Data Analyst\" berhasil dikirim.', 'email', 0, '2026-05-17 09:40:04'),
(28, 3, 'Pelamar Baru 📩', 'Ada pelamar baru (Farhan) pada lowongan \"Data Analyst\".', 'in_app', 0, '2026-05-17 09:40:17'),
(29, 9, 'Pelamar Baru 📩', 'Ada pelamar baru (Farhan) pada lowongan \"Data Analyst\".', 'in_app', 0, '2026-05-17 09:40:17'),
(30, 10, 'Pelamar Baru 📩', 'Ada pelamar baru (Farhan) pada lowongan \"Data Analyst\".', 'in_app', 0, '2026-05-17 09:40:17'),
(31, 3, 'Status Lamaran Diperbarui', 'Lamaran Anda pada \"Data Analyst\" di PT maju yok dipanggil untuk interview 📞. Silakan cek email Anda untuk informasi lebih lanjut.', 'in_app', 0, '2026-05-17 09:53:41'),
(32, 3, 'Email Notifikasi: Status Lamaran', 'Lamaran Anda pada \"Data Analyst\" di PT maju yok dipanggil untuk interview 📞. Silakan cek email Anda untuk informasi lebih lanjut.', 'email', 0, '2026-05-17 09:53:41'),
(33, 3, 'Status Lamaran Diperbarui', 'Lamaran Anda pada \"Data Analyst\" di PT maju yok diterima 🎉 Selamat!.', 'in_app', 0, '2026-05-17 09:54:16'),
(34, 3, 'Email Notifikasi: Status Lamaran', 'Lamaran Anda pada \"Data Analyst\" di PT maju yok diterima 🎉 Selamat!.', 'email', 0, '2026-05-17 09:54:16'),
(35, 3, 'Lamaran Berhasil Dikirim ✅', 'Lamaran Anda pada \"full stack\" di PT Digital Nusantara berhasil dikirim. Pantau status lamaran Anda di halaman Lamaran Saya.', 'in_app', 0, '2026-05-17 12:24:47'),
(36, 3, 'Email: Lamaran Berhasil', 'Lamaran pada \"full stack\" berhasil dikirim.', 'email', 0, '2026-05-17 12:24:47'),
(37, 3, 'Pelamar Baru 📩', 'Ada pelamar baru (Farhan) pada lowongan \"full stack\".', 'in_app', 0, '2026-05-17 12:24:57'),
(38, 9, 'Pelamar Baru 📩', 'Ada pelamar baru (Farhan) pada lowongan \"full stack\".', 'in_app', 0, '2026-05-17 12:24:57'),
(39, 10, 'Pelamar Baru 📩', 'Ada pelamar baru (Farhan) pada lowongan \"full stack\".', 'in_app', 0, '2026-05-17 12:24:57'),
(40, 3, 'Status Lamaran Diperbarui', 'Lamaran Anda pada \"full stack\" di PT Digital Nusantara dipanggil untuk interview 📞. Silakan cek email Anda untuk informasi lebih lanjut.', 'in_app', 0, '2026-05-17 12:37:31'),
(41, 3, 'Email Notifikasi: Status Lamaran', 'Lamaran Anda pada \"full stack\" di PT Digital Nusantara dipanggil untuk interview 📞. Silakan cek email Anda untuk informasi lebih lanjut.', 'email', 0, '2026-05-17 12:37:31'),
(42, 3, 'Status Lamaran Diperbarui', 'Lamaran Anda pada \"full stack\" di PT Digital Nusantara ditolak ❌.', 'in_app', 0, '2026-05-17 12:44:12'),
(43, 3, 'Email Notifikasi: Status Lamaran', 'Lamaran Anda pada \"full stack\" di PT Digital Nusantara ditolak ❌.', 'email', 0, '2026-05-17 12:44:12'),
(44, 3, 'Lowongan Dikirim untuk Review', 'Lowongan \"Data Engginer\" berhasil dikirim dan sedang menunggu persetujuan Kaprodi.', 'in_app', 0, '2026-05-18 04:11:24'),
(45, 9, 'Lowongan Baru Menunggu Review', 'Ada lowongan baru \"Data Engginer\" dari Farhan yang perlu direview.', 'in_app', 0, '2026-05-18 04:11:24'),
(46, 10, 'Lowongan Baru Menunggu Review', 'Ada lowongan baru \"Data Engginer\" dari Farhan yang perlu direview.', 'in_app', 0, '2026-05-18 04:11:24'),
(47, 3, 'Lamaran Berhasil Dikirim ✅', 'Lamaran Anda pada \"ffff\" di PT maju yok berhasil dikirim. Pantau status lamaran Anda di halaman Lamaran Saya.', 'in_app', 0, '2026-05-18 04:17:18'),
(48, 3, 'Email: Lamaran Berhasil', 'Lamaran pada \"ffff\" berhasil dikirim.', 'email', 0, '2026-05-18 04:17:18'),
(49, 3, 'Pelamar Baru 📩', 'Ada pelamar baru (Farhan) pada lowongan \"ffff\".', 'in_app', 0, '2026-05-18 04:17:31'),
(50, 9, 'Pelamar Baru 📩', 'Ada pelamar baru (Farhan) pada lowongan \"ffff\".', 'in_app', 0, '2026-05-18 04:17:31'),
(51, 10, 'Pelamar Baru 📩', 'Ada pelamar baru (Farhan) pada lowongan \"ffff\".', 'in_app', 0, '2026-05-18 04:17:31'),
(52, 9, 'Lowongan Dikirim untuk Review', 'Lowongan \"Game Developer\" berhasil dikirim dan sedang menunggu persetujuan Kaprodi.', 'in_app', 0, '2026-05-18 04:53:54'),
(53, 3, 'Status Lowongan Diperbarui', 'Lowongan \"Data Engginer\" Anda telah disetujui ✅.', 'in_app', 0, '2026-05-18 08:24:30'),
(54, 3, 'Email Notifikasi: Status Lowongan', 'Lowongan \"Data Engginer\" Anda telah disetujui ✅.', 'email', 0, '2026-05-18 08:24:30');

-- --------------------------------------------------------

--
-- Struktur dari tabel `otp_verifications`
--

CREATE TABLE `otp_verifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `otp_code` varchar(6) NOT NULL,
  `expired_at` datetime NOT NULL,
  `is_verified` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `otp_verifications`
--

INSERT INTO `otp_verifications` (`id`, `user_id`, `otp_code`, `expired_at`, `is_verified`, `created_at`) VALUES
(1, 1, '591027', '2026-05-15 03:49:10', 0, '2026-05-15 03:39:10'),
(2, 2, '452449', '2026-05-15 04:01:00', 0, '2026-05-15 03:51:00'),
(3, 3, '339389', '2026-05-15 04:08:30', 1, '2026-05-15 03:58:30'),
(4, 4, '361219', '2026-05-15 04:12:16', 1, '2026-05-15 04:02:16'),
(9, 9, '265244', '2026-05-15 07:09:27', 1, '2026-05-15 06:59:27'),
(10, 10, '293617', '2026-05-16 07:03:14', 0, '2026-05-16 06:53:14'),
(11, 11, '633158', '2026-05-18 08:45:57', 1, '2026-05-18 08:35:57'),
(12, 12, '570748', '2026-05-18 08:55:32', 0, '2026-05-18 08:45:32');

-- --------------------------------------------------------

--
-- Struktur dari tabel `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(14, 'App\\Models\\User', 5, 'auth-token', 'f708346df5cb66488caa5c20489bd24f74f6b6d6f4b2c9a34a5c11726503f645', '[\"*\"]', '2026-05-14 23:32:59', NULL, '2026-05-14 22:59:39', '2026-05-14 23:32:59'),
(15, 'App\\Models\\User', 4, 'auth-token', '71e3d1ec3e090005ad0719fcda19bcb6cd13a4f08bdd1bc20fdb644f96d1a4ef', '[\"*\"]', '2026-05-14 23:34:21', NULL, '2026-05-14 23:33:43', '2026-05-14 23:34:21'),
(17, 'App\\Models\\User', 6, 'auth-token', '823ea8e26c92587b5e595a1e215c5a9affdbba3923e6c4809cd516661cab79ff', '[\"*\"]', '2026-05-14 23:43:34', NULL, '2026-05-14 23:43:20', '2026-05-14 23:43:34'),
(107, 'App\\Models\\User', 9, 'auth-token', 'f0ac2b6b5998a06dc8a858992cdcda06f1998b91fa8d7c0bc32f683a73939ef1', '[\"*\"]', '2026-05-18 01:32:43', NULL, '2026-05-18 01:23:37', '2026-05-18 01:32:43'),
(108, 'App\\Models\\User', 11, 'auth-token', 'dfe19c4e3c0dc528c8bebd687e7f6163843738132c0fbe6db04f3fddea097444', '[\"*\"]', '2026-05-18 01:44:03', NULL, '2026-05-18 01:36:46', '2026-05-18 01:44:03'),
(109, 'App\\Models\\User', 3, 'auth-token', 'acb8b2cca1c305c4cbffd96f754121f1ace7fe527b57040a70a54b357ef164eb', '[\"*\"]', '2026-05-18 01:44:38', NULL, '2026-05-18 01:44:08', '2026-05-18 01:44:38');

-- --------------------------------------------------------

--
-- Struktur dari tabel `recycle_bins`
--

CREATE TABLE `recycle_bins` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `job_id` bigint(20) UNSIGNED NOT NULL,
  `deleted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `restored_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('1tSH3ZOG26pb8inntndkwqTyzSCwuPsKiGXvo3Ob', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYmpiaG9wSVNtVk1WTXZRRmMwV0pwTFdVaGtHeENzeFlObHNwNlJiaSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778814865),
('SajoWdtM8CI5iMAEY6wKzbLyYVUPCRYkYFaFXdTV', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNG5Da0owZ0R2V0k5dUNwVERPTXRuWDNqTUo1RVNTaXJYbEhsMTVCciI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778815428);

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `nim` varchar(20) DEFAULT NULL COMMENT 'Nomor Induk Mahasiswa (hanya mahasiswa)',
  `nip` varchar(20) DEFAULT NULL COMMENT 'Nomor Induk Pegawai (hanya kaprodi)',
  `email` varchar(100) NOT NULL,
  `gender` enum('Laki-laki','Perempuan') DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `domicile_address` text DEFAULT NULL,
  `fakultas` varchar(255) DEFAULT NULL,
  `jurusan` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('mahasiswa','kaprodi') NOT NULL DEFAULT 'mahasiswa',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `name`, `nim`, `nip`, `email`, `gender`, `phone`, `address`, `domicile_address`, `fakultas`, `jurusan`, `avatar`, `password`, `role`, `created_at`, `updated_at`) VALUES
(1, 'Test Mahasiswa', '2021010001', NULL, 'test123@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2y$12$4z9aETJmVwLNigz1iIIIr.VbOaMG8R5p/5xwRAkNU2EumJkgiKbTK', 'mahasiswa', '2026-05-14 20:39:10', '2026-05-14 20:39:10'),
(2, 'andi', '2303015143', NULL, 'andi11farhan@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2y$12$py/tO.hfXUqM60stWljyYeOK9jKYCIYNzxeOIKfnJJ0QH4xFgaMAC', 'mahasiswa', '2026-05-14 20:51:00', '2026-05-14 20:51:00'),
(3, 'Farhan', '2303015144', NULL, 'rezaf0895@gmail.com', 'Laki-laki', '081295268535', 'tj barat gg 100', 'jagakarsa', 'FT (Teknik)', 'Teknik Informatika', 'avatars/3/m25sQIk08I7XbvJnKQ4EYNa494ebqlWexsRmvgnZ.jpg', '$2y$12$vu7RiT//nyW1r2Nke1Sg..SBuY0XKGwzXH0lfBFYcbpSFPS2Utnkq', 'mahasiswa', '2026-05-14 20:58:30', '2026-05-17 05:58:42'),
(4, 'andi', '123345678', NULL, 'andifarhan2501@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2y$12$f2lztoIYdKZuX3q2EiWD8uTHs4lokdpytKB71RCMThe5q1ZNh8b0C', 'mahasiswa', '2026-05-14 21:02:16', '2026-05-14 21:02:16'),
(9, 'kaprodi1_fakultas teknik', NULL, '123456', '2303015143@uhamka.ac.id', NULL, '08218463482', 'FT (Teknik)', 'Jl. Limau II No.2, RT.3/RW.3, Kramat Pela, Kec. Kby. Baru, City, Daerah Khusus Ibukota Jakarta 12130', NULL, NULL, 'avatars/9/PDz9Re1IYlgdidgRU98YseFyCVd2SVQhwTCTaB30.jpg', '$2y$12$Tz1mISsxnd5ESNS272oBY.JWtRAUgxkxg/mUkFeLkV2E0px9JSG.O', 'kaprodi', '2026-05-14 23:59:27', '2026-05-17 01:01:54'),
(10, 'Test Kaprodi', NULL, '1234567890', 'testkaprodi@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2y$12$mYkUj6lCzjms6qtW4VLuDO9LGnYGHz.VjFeMyJKa8wqYPWAEHYS8m', 'kaprodi', '2026-05-15 23:53:14', '2026-05-15 23:53:14'),
(11, 'BPTI', NULL, '5678901', 'uhamka46@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2y$12$t1SmN75ff0nHSbFzyQX4JeqHtB8qiRGGyvEA5l1rSdvn2dv2YoB8y', 'kaprodi', '2026-05-18 01:35:57', '2026-05-18 01:35:57'),
(12, 'tetw', '2303015148', NULL, 'gsg@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2y$12$RY5W73DjSbDj4wvLKMGpwOnyWgpIxmuzhKF7I6W0zEHsLe1pfz4GG', 'mahasiswa', '2026-05-18 01:45:32', '2026-05-18 01:45:32');

-- --------------------------------------------------------

--
-- Struktur dari tabel `user_documents`
--

CREATE TABLE `user_documents` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `type` enum('pendidikan','pelatihan','sertifikasi','pengalaman','keterampilan','pencapaian','cv') NOT NULL,
  `description` text NOT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `user_documents`
--

INSERT INTO `user_documents` (`id`, `user_id`, `type`, `description`, `file_path`, `created_at`, `updated_at`) VALUES
(1, 3, 'cv', 'zzzz', 'documents/3/RLVGii4a69CVwN89swt4RGPLKQ4WAoeFmE3KS5h5.pdf', '2026-05-14 21:47:24', '2026-05-14 21:47:24'),
(2, 3, 'sertifikasi', 'zzz', 'documents/3/XMz2YI8GbdRCwVZP2td5p0XbVmqWUHuqFtpith8a.pdf', '2026-05-14 21:47:33', '2026-05-14 21:47:33'),
(3, 3, 'pengalaman', 'zzz', 'documents/3/oK1G5ZMepEUXaT8MqbyrnvFyLWIx53uT3v86ttdM.pdf', '2026-05-14 21:47:41', '2026-05-14 21:47:41'),
(4, 3, 'pendidikan', 'zzz', 'documents/3/hzuzHEd7pQNdtKYleBYjxRNLe7KPAIjnWRIqUXoU.pdf', '2026-05-14 21:48:12', '2026-05-14 21:48:12'),
(5, 3, 'keterampilan', 'zzz', 'documents/3/ywaL8jrDMXf8RcLFeWlzSEf6Gxxcha5dTc5xxWMI.pdf', '2026-05-14 21:48:29', '2026-05-14 21:48:29'),
(6, 3, 'pencapaian', 'zzz', 'documents/3/RuxU1CZIoECeoTcfCXGKz0VPVWutikyUPmTg7yuG.pdf', '2026-05-14 21:48:34', '2026-05-14 21:48:34'),
(7, 3, 'pelatihan', 'zzz', 'documents/3/QpnCCZzt6xj3exevjAc7FxpsMKn8ZoJcR2j1nBPW.pdf', '2026-05-14 21:48:52', '2026-05-14 21:48:52');

-- --------------------------------------------------------

--
-- Struktur dari tabel `user_languages`
--

CREATE TABLE `user_languages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `language` varchar(255) NOT NULL,
  `score` int(11) NOT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `user_languages`
--

INSERT INTO `user_languages` (`id`, `user_id`, `language`, `score`, `file_path`, `created_at`, `updated_at`) VALUES
(1, 3, 'Inggris', 33, 'languages/3/n8x2XPhXcfsYI0SkyEJ5AtNyBeHoLr2birqHJzWY.pdf', '2026-05-14 21:47:53', '2026-05-14 21:47:53'),
(2, 3, 'Arab', 600, 'languages/3/Q5E9gIJ9WQDNxd2RdmqEIYKImKiat9oX18k0KWb5.pdf', '2026-05-16 00:41:05', '2026-05-16 00:41:05');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `activity_logs_user_id_foreign` (`user_id`);

--
-- Indeks untuk tabel `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `applications_user_id_job_id_unique` (`user_id`,`job_id`),
  ADD KEY `applications_job_id_foreign` (`job_id`);

--
-- Indeks untuk tabel `bookmarks`
--
ALTER TABLE `bookmarks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `bookmarks_user_id_job_id_unique` (`user_id`,`job_id`),
  ADD KEY `bookmarks_job_id_foreign` (`job_id`);

--
-- Indeks untuk tabel `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indeks untuk tabel `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indeks untuk tabel `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_user_id_foreign` (`user_id`),
  ADD KEY `jobs_category_id_foreign` (`category_id`),
  ADD KEY `jobs_major_id_foreign` (`major_id`);

--
-- Indeks untuk tabel `job_reviews`
--
ALTER TABLE `job_reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `job_reviews_job_id_foreign` (`job_id`),
  ADD KEY `job_reviews_kaprodi_id_foreign` (`kaprodi_id`);

--
-- Indeks untuk tabel `majors`
--
ALTER TABLE `majors`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `messages_sender_id_receiver_id_index` (`sender_id`,`receiver_id`),
  ADD KEY `messages_receiver_id_is_read_index` (`receiver_id`,`is_read`);

--
-- Indeks untuk tabel `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `mitras`
--
ALTER TABLE `mitras`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mitras_name_unique` (`name`);

--
-- Indeks untuk tabel `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_user_id_foreign` (`user_id`);

--
-- Indeks untuk tabel `otp_verifications`
--
ALTER TABLE `otp_verifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `otp_verifications_user_id_foreign` (`user_id`);

--
-- Indeks untuk tabel `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indeks untuk tabel `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indeks untuk tabel `recycle_bins`
--
ALTER TABLE `recycle_bins`
  ADD PRIMARY KEY (`id`),
  ADD KEY `recycle_bins_job_id_foreign` (`job_id`);

--
-- Indeks untuk tabel `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_nim_unique` (`nim`),
  ADD UNIQUE KEY `users_nip_unique` (`nip`);

--
-- Indeks untuk tabel `user_documents`
--
ALTER TABLE `user_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_documents_user_id_foreign` (`user_id`);

--
-- Indeks untuk tabel `user_languages`
--
ALTER TABLE `user_languages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_languages_user_id_foreign` (`user_id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT untuk tabel `applications`
--
ALTER TABLE `applications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `bookmarks`
--
ALTER TABLE `bookmarks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT untuk tabel `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT untuk tabel `job_reviews`
--
ALTER TABLE `job_reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `majors`
--
ALTER TABLE `majors`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT untuk tabel `messages`
--
ALTER TABLE `messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT untuk tabel `mitras`
--
ALTER TABLE `mitras`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT untuk tabel `otp_verifications`
--
ALTER TABLE `otp_verifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT untuk tabel `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=110;

--
-- AUTO_INCREMENT untuk tabel `recycle_bins`
--
ALTER TABLE `recycle_bins`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT untuk tabel `user_documents`
--
ALTER TABLE `user_documents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `user_languages`
--
ALTER TABLE `user_languages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `applications`
--
ALTER TABLE `applications`
  ADD CONSTRAINT `applications_job_id_foreign` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `applications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `bookmarks`
--
ALTER TABLE `bookmarks`
  ADD CONSTRAINT `bookmarks_job_id_foreign` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookmarks_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `jobs`
--
ALTER TABLE `jobs`
  ADD CONSTRAINT `jobs_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `jobs_major_id_foreign` FOREIGN KEY (`major_id`) REFERENCES `majors` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `jobs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `job_reviews`
--
ALTER TABLE `job_reviews`
  ADD CONSTRAINT `job_reviews_job_id_foreign` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `job_reviews_kaprodi_id_foreign` FOREIGN KEY (`kaprodi_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_receiver_id_foreign` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_sender_id_foreign` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `otp_verifications`
--
ALTER TABLE `otp_verifications`
  ADD CONSTRAINT `otp_verifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `recycle_bins`
--
ALTER TABLE `recycle_bins`
  ADD CONSTRAINT `recycle_bins_job_id_foreign` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `user_documents`
--
ALTER TABLE `user_documents`
  ADD CONSTRAINT `user_documents_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `user_languages`
--
ALTER TABLE `user_languages`
  ADD CONSTRAINT `user_languages_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
