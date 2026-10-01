import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_hero_home_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_hero_home_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_hero_home_variant" AS ENUM('split', 'fullImage');
  CREATE TYPE "public"."enum_pages_blocks_hero_home_settings_background" AS ENUM('default', 'alt', 'tint', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_hero_home_settings_spacing" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_hero_home_settings_hide_on" AS ENUM('none', 'mobile', 'desktop', 'all');
  CREATE TYPE "public"."enum_pages_blocks_page_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_page_hero_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_page_hero_variant" AS ENUM('split', 'simple', 'image');
  CREATE TYPE "public"."enum_pages_blocks_page_hero_settings_background" AS ENUM('default', 'alt', 'tint', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_page_hero_settings_spacing" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_page_hero_settings_hide_on" AS ENUM('none', 'mobile', 'desktop', 'all');
  CREATE TYPE "public"."enum_pages_blocks_services_grid_variant" AS ENUM('bento', 'cards', 'list');
  CREATE TYPE "public"."enum_pages_blocks_services_grid_source" AS ENUM('all', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_services_grid_link_to" AS ENUM('service', 'projects');
  CREATE TYPE "public"."enum_pages_blocks_services_grid_settings_background" AS ENUM('default', 'alt', 'tint', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_services_grid_settings_spacing" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_services_grid_settings_hide_on" AS ENUM('none', 'mobile', 'desktop', 'all');
  CREATE TYPE "public"."enum_pages_blocks_featured_projects_source" AS ENUM('latest', 'featured', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_featured_projects_settings_background" AS ENUM('default', 'alt', 'tint', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_featured_projects_settings_spacing" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_featured_projects_settings_hide_on" AS ENUM('none', 'mobile', 'desktop', 'all');
  CREATE TYPE "public"."enum_pages_blocks_split_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_split_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_split_image_position" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum_pages_blocks_split_settings_background" AS ENUM('default', 'alt', 'tint', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_split_settings_spacing" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_split_settings_hide_on" AS ENUM('none', 'mobile', 'desktop', 'all');
  CREATE TYPE "public"."enum_pages_blocks_cards_items_icon" AS ENUM('mulch', 'clear', 'grade', 'demo', 'excav', 'drive', 'pad', 'clean', 'pavers', 'roof', 'check', 'phone', 'pin', 'area', 'calendar', 'clock', 'shield', 'star', 'users', 'leaf', 'truck', 'hammer', 'award', 'handshake', 'mail', 'techGps', 'techDrone', 'techLaser', 'techDoc');
  CREATE TYPE "public"."enum_pages_blocks_cards_variant" AS ENUM('value', 'icon', 'row');
  CREATE TYPE "public"."enum_pages_blocks_cards_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_cards_settings_background" AS ENUM('default', 'alt', 'tint', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_cards_settings_spacing" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_cards_settings_hide_on" AS ENUM('none', 'mobile', 'desktop', 'all');
  CREATE TYPE "public"."enum_pages_blocks_steps_settings_background" AS ENUM('default', 'alt', 'tint', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_steps_settings_spacing" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_steps_settings_hide_on" AS ENUM('none', 'mobile', 'desktop', 'all');
  CREATE TYPE "public"."enum_pages_blocks_stats_settings_background" AS ENUM('default', 'alt', 'tint', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_stats_settings_spacing" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_stats_settings_hide_on" AS ENUM('none', 'mobile', 'desktop', 'all');
  CREATE TYPE "public"."enum_pages_blocks_equipment_grid_categories" AS ENUM('excavator', 'mulcher', 'loader', 'dozer', 'wheel-loader', 'truck', 'tools', 'other');
  CREATE TYPE "public"."enum_pages_blocks_equipment_grid_settings_background" AS ENUM('default', 'alt', 'tint', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_equipment_grid_settings_spacing" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_equipment_grid_settings_hide_on" AS ENUM('none', 'mobile', 'desktop', 'all');
  CREATE TYPE "public"."enum_pages_blocks_checklist_settings_background" AS ENUM('default', 'alt', 'tint', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_checklist_settings_spacing" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_checklist_settings_hide_on" AS ENUM('none', 'mobile', 'desktop', 'all');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_source" AS ENUM('latest', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_settings_background" AS ENUM('default', 'alt', 'tint', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_settings_spacing" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_settings_hide_on" AS ENUM('none', 'mobile', 'desktop', 'all');
  CREATE TYPE "public"."enum_pages_blocks_faq_settings_background" AS ENUM('default', 'alt', 'tint', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_faq_settings_spacing" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_faq_settings_hide_on" AS ENUM('none', 'mobile', 'desktop', 'all');
  CREATE TYPE "public"."enum_pages_blocks_service_areas_settings_background" AS ENUM('default', 'alt', 'tint', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_service_areas_settings_spacing" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_service_areas_settings_hide_on" AS ENUM('none', 'mobile', 'desktop', 'all');
  CREATE TYPE "public"."enum_pages_blocks_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_gallery_settings_background" AS ENUM('default', 'alt', 'tint', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_gallery_settings_spacing" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_gallery_settings_hide_on" AS ENUM('none', 'mobile', 'desktop', 'all');
  CREATE TYPE "public"."enum_pages_blocks_contact_section_settings_background" AS ENUM('default', 'alt', 'tint', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_contact_section_settings_spacing" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_contact_section_settings_hide_on" AS ENUM('none', 'mobile', 'desktop', 'all');
  CREATE TYPE "public"."enum_pages_blocks_cta_band_style" AS ENUM('gradient', 'dark', 'image');
  CREATE TYPE "public"."enum_pages_blocks_cta_band_settings_background" AS ENUM('default', 'alt', 'tint', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_cta_band_settings_spacing" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_cta_band_settings_hide_on" AS ENUM('none', 'mobile', 'desktop', 'all');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_pages_blocks_archive_relation_to" AS ENUM('posts');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_home_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_home_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_home_variant" AS ENUM('split', 'fullImage');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_home_settings_background" AS ENUM('default', 'alt', 'tint', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_home_settings_spacing" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_home_settings_hide_on" AS ENUM('none', 'mobile', 'desktop', 'all');
  CREATE TYPE "public"."enum__pages_v_blocks_page_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_page_hero_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_page_hero_variant" AS ENUM('split', 'simple', 'image');
  CREATE TYPE "public"."enum__pages_v_blocks_page_hero_settings_background" AS ENUM('default', 'alt', 'tint', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_page_hero_settings_spacing" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_page_hero_settings_hide_on" AS ENUM('none', 'mobile', 'desktop', 'all');
  CREATE TYPE "public"."enum__pages_v_blocks_services_grid_variant" AS ENUM('bento', 'cards', 'list');
  CREATE TYPE "public"."enum__pages_v_blocks_services_grid_source" AS ENUM('all', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_services_grid_link_to" AS ENUM('service', 'projects');
  CREATE TYPE "public"."enum__pages_v_blocks_services_grid_settings_background" AS ENUM('default', 'alt', 'tint', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_services_grid_settings_spacing" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_services_grid_settings_hide_on" AS ENUM('none', 'mobile', 'desktop', 'all');
  CREATE TYPE "public"."enum__pages_v_blocks_featured_projects_source" AS ENUM('latest', 'featured', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_featured_projects_settings_background" AS ENUM('default', 'alt', 'tint', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_featured_projects_settings_spacing" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_featured_projects_settings_hide_on" AS ENUM('none', 'mobile', 'desktop', 'all');
  CREATE TYPE "public"."enum__pages_v_blocks_split_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_split_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_split_image_position" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum__pages_v_blocks_split_settings_background" AS ENUM('default', 'alt', 'tint', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_split_settings_spacing" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_split_settings_hide_on" AS ENUM('none', 'mobile', 'desktop', 'all');
  CREATE TYPE "public"."enum__pages_v_blocks_cards_items_icon" AS ENUM('mulch', 'clear', 'grade', 'demo', 'excav', 'drive', 'pad', 'clean', 'pavers', 'roof', 'check', 'phone', 'pin', 'area', 'calendar', 'clock', 'shield', 'star', 'users', 'leaf', 'truck', 'hammer', 'award', 'handshake', 'mail', 'techGps', 'techDrone', 'techLaser', 'techDoc');
  CREATE TYPE "public"."enum__pages_v_blocks_cards_variant" AS ENUM('value', 'icon', 'row');
  CREATE TYPE "public"."enum__pages_v_blocks_cards_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_cards_settings_background" AS ENUM('default', 'alt', 'tint', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_cards_settings_spacing" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_cards_settings_hide_on" AS ENUM('none', 'mobile', 'desktop', 'all');
  CREATE TYPE "public"."enum__pages_v_blocks_steps_settings_background" AS ENUM('default', 'alt', 'tint', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_steps_settings_spacing" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_steps_settings_hide_on" AS ENUM('none', 'mobile', 'desktop', 'all');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_settings_background" AS ENUM('default', 'alt', 'tint', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_settings_spacing" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_settings_hide_on" AS ENUM('none', 'mobile', 'desktop', 'all');
  CREATE TYPE "public"."enum__pages_v_blocks_equipment_grid_categories" AS ENUM('excavator', 'mulcher', 'loader', 'dozer', 'wheel-loader', 'truck', 'tools', 'other');
  CREATE TYPE "public"."enum__pages_v_blocks_equipment_grid_settings_background" AS ENUM('default', 'alt', 'tint', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_equipment_grid_settings_spacing" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_equipment_grid_settings_hide_on" AS ENUM('none', 'mobile', 'desktop', 'all');
  CREATE TYPE "public"."enum__pages_v_blocks_checklist_settings_background" AS ENUM('default', 'alt', 'tint', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_checklist_settings_spacing" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_checklist_settings_hide_on" AS ENUM('none', 'mobile', 'desktop', 'all');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_source" AS ENUM('latest', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_settings_background" AS ENUM('default', 'alt', 'tint', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_settings_spacing" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_settings_hide_on" AS ENUM('none', 'mobile', 'desktop', 'all');
  CREATE TYPE "public"."enum__pages_v_blocks_faq_settings_background" AS ENUM('default', 'alt', 'tint', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_faq_settings_spacing" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_faq_settings_hide_on" AS ENUM('none', 'mobile', 'desktop', 'all');
  CREATE TYPE "public"."enum__pages_v_blocks_service_areas_settings_background" AS ENUM('default', 'alt', 'tint', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_service_areas_settings_spacing" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_service_areas_settings_hide_on" AS ENUM('none', 'mobile', 'desktop', 'all');
  CREATE TYPE "public"."enum__pages_v_blocks_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_gallery_settings_background" AS ENUM('default', 'alt', 'tint', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_gallery_settings_spacing" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_gallery_settings_hide_on" AS ENUM('none', 'mobile', 'desktop', 'all');
  CREATE TYPE "public"."enum__pages_v_blocks_contact_section_settings_background" AS ENUM('default', 'alt', 'tint', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_contact_section_settings_spacing" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_contact_section_settings_hide_on" AS ENUM('none', 'mobile', 'desktop', 'all');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_band_style" AS ENUM('gradient', 'dark', 'image');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_band_settings_background" AS ENUM('default', 'alt', 'tint', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_band_settings_spacing" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_band_settings_hide_on" AS ENUM('none', 'mobile', 'desktop', 'all');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_relation_to" AS ENUM('posts');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_projects_client_type" AS ENUM('residential', 'commercial', 'municipal', 'agricultural');
  CREATE TYPE "public"."enum_projects_lot_unit" AS ENUM('acres', 'sqft');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_version_client_type" AS ENUM('residential', 'commercial', 'municipal', 'agricultural');
  CREATE TYPE "public"."enum__projects_v_version_lot_unit" AS ENUM('acres', 'sqft');
  CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_services_icon" AS ENUM('mulch', 'clear', 'grade', 'demo', 'excav', 'drive', 'pad', 'clean', 'pavers', 'roof', 'check', 'phone', 'pin', 'area', 'calendar', 'clock', 'shield', 'star', 'users', 'leaf', 'truck', 'hammer', 'award', 'handshake', 'mail');
  CREATE TYPE "public"."enum_equipment_category" AS ENUM('excavator', 'mulcher', 'loader', 'dozer', 'wheel-loader', 'truck', 'tools', 'other');
  CREATE TYPE "public"."enum_equipment_icon" AS ENUM('fleetExcavator', 'fleetMulcher', 'fleetSkid', 'fleetDozer', 'fleetWheelLoader', 'fleetDumpTruck');
  CREATE TYPE "public"."enum_testimonials_source" AS ENUM('direct', 'google', 'facebook', 'angi', 'yelp');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_redirects_to_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_forms_confirmation_type" AS ENUM('message', 'redirect');
  CREATE TYPE "public"."enum_form_submissions_status" AS ENUM('new', 'contacted', 'quoted', 'won', 'lost');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_folders_folder_type" AS ENUM('media');
  CREATE TYPE "public"."enum_site_settings_socials_platform" AS ENUM('facebook', 'instagram', 'youtube', 'tiktok', 'linkedin', 'x', 'google', 'yelp');
  CREATE TYPE "public"."enum_site_settings_business_type" AS ENUM('GeneralContractor', 'HomeAndConstructionBusiness', 'RoofingContractor', 'LocalBusiness');
  CREATE TYPE "public"."enum_theme_preset" AS ENUM('classic', 'heavyIron', 'earthStone');
  CREATE TYPE "public"."enum_theme_font_display" AS ENUM('preset', 'russo', 'montserrat', 'inter', 'oswald', 'barlowCondensed', 'barlow', 'archivo', 'playfair', 'dmSans');
  CREATE TYPE "public"."enum_theme_font_body" AS ENUM('preset', 'russo', 'montserrat', 'inter', 'oswald', 'barlowCondensed', 'barlow', 'archivo', 'playfair', 'dmSans');
  CREATE TYPE "public"."enum_theme_heading_case" AS ENUM('preset', 'uppercase', 'none');
  CREATE TYPE "public"."enum_theme_radius" AS ENUM('preset', 'sharp', 'soft', 'rounded');
  CREATE TYPE "public"."enum_theme_button_shape" AS ENUM('preset', 'square', 'rounded', 'pill');
  CREATE TYPE "public"."enum_theme_card_style" AS ENUM('preset', 'bordered', 'shadow', 'flat');
  CREATE TYPE "public"."enum_theme_container" AS ENUM('preset', 'narrow', 'default', 'wide');
  CREATE TYPE "public"."enum_theme_header_style" AS ENUM('preset', 'light', 'dark', 'brand');
  CREATE TYPE "public"."enum_theme_footer_style" AS ENUM('preset', 'light', 'dark');
  CREATE TYPE "public"."enum_header_nav_items_children_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_header_nav_items_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_footer_columns_nav_items_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_footer_legal_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_listing_pages_projects_filters" AS ENUM('q', 'service', 'area', 'size', 'year', 'type', 'sort');
  CREATE TABLE "pages_blocks_hero_home_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_blocks_hero_home_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_hero_home_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_hero_home_trust" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_home" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_hero_home_variant" DEFAULT 'split',
  	"show_logo" boolean DEFAULT true,
  	"heading" varchar,
  	"lede" varchar,
  	"image_id" integer,
  	"show_badge" boolean DEFAULT true,
  	"show_call_card" boolean DEFAULT true,
  	"call_card_text" varchar DEFAULT 'Call or text for a site visit',
  	"settings_background" "enum_pages_blocks_hero_home_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_hero_home_settings_spacing" DEFAULT 'md',
  	"settings_hide_on" "enum_pages_blocks_hero_home_settings_hide_on" DEFAULT 'none',
  	"settings_anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_page_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_blocks_page_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_page_hero_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_page_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_page_hero_variant" DEFAULT 'split',
  	"show_breadcrumbs" boolean DEFAULT true,
  	"heading" varchar,
  	"lede" varchar,
  	"image_id" integer,
  	"settings_background" "enum_pages_blocks_page_hero_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_page_hero_settings_spacing" DEFAULT 'md',
  	"settings_hide_on" "enum_pages_blocks_page_hero_settings_hide_on" DEFAULT 'none',
  	"settings_anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_services_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"lede" varchar,
  	"header_link_label" varchar,
  	"header_link_url" varchar,
  	"variant" "enum_pages_blocks_services_grid_variant" DEFAULT 'bento',
  	"source" "enum_pages_blocks_services_grid_source" DEFAULT 'all',
  	"link_to" "enum_pages_blocks_services_grid_link_to" DEFAULT 'service',
  	"settings_background" "enum_pages_blocks_services_grid_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_services_grid_settings_spacing" DEFAULT 'md',
  	"settings_hide_on" "enum_pages_blocks_services_grid_settings_hide_on" DEFAULT 'none',
  	"settings_anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_featured_projects" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"lede" varchar,
  	"header_link_label" varchar,
  	"header_link_url" varchar,
  	"source" "enum_pages_blocks_featured_projects_source" DEFAULT 'latest',
  	"limit" numeric DEFAULT 3,
  	"filter_service_id" integer,
  	"settings_background" "enum_pages_blocks_featured_projects_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_featured_projects_settings_spacing" DEFAULT 'md',
  	"settings_hide_on" "enum_pages_blocks_featured_projects_settings_hide_on" DEFAULT 'none',
  	"settings_anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_split_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_blocks_split_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_split_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"lede" varchar,
  	"body" jsonb,
  	"image_id" integer,
  	"image_position" "enum_pages_blocks_split_image_position" DEFAULT 'right',
  	"stamp_title" varchar,
  	"stamp_text" varchar,
  	"settings_background" "enum_pages_blocks_split_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_split_settings_spacing" DEFAULT 'md',
  	"settings_hide_on" "enum_pages_blocks_split_settings_hide_on" DEFAULT 'none',
  	"settings_anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"icon" "enum_pages_blocks_cards_items_icon",
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"lede" varchar,
  	"header_link_label" varchar,
  	"header_link_url" varchar,
  	"variant" "enum_pages_blocks_cards_variant" DEFAULT 'value',
  	"columns" "enum_pages_blocks_cards_columns" DEFAULT '3',
  	"settings_background" "enum_pages_blocks_cards_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_cards_settings_spacing" DEFAULT 'md',
  	"settings_hide_on" "enum_pages_blocks_cards_settings_hide_on" DEFAULT 'none',
  	"settings_anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"lede" varchar,
  	"settings_background" "enum_pages_blocks_steps_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_steps_settings_spacing" DEFAULT 'md',
  	"settings_hide_on" "enum_pages_blocks_steps_settings_hide_on" DEFAULT 'none',
  	"settings_anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"lede" varchar,
  	"settings_background" "enum_pages_blocks_stats_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_stats_settings_spacing" DEFAULT 'md',
  	"settings_hide_on" "enum_pages_blocks_stats_settings_hide_on" DEFAULT 'none',
  	"settings_anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_equipment_grid_categories" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_equipment_grid_categories",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_equipment_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"lede" varchar,
  	"show_filter" boolean DEFAULT true,
  	"settings_background" "enum_pages_blocks_equipment_grid_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_equipment_grid_settings_spacing" DEFAULT 'md',
  	"settings_hide_on" "enum_pages_blocks_equipment_grid_settings_hide_on" DEFAULT 'none',
  	"settings_anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_checklist_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_checklist" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"lede" varchar,
  	"settings_background" "enum_pages_blocks_checklist_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_checklist_settings_spacing" DEFAULT 'md',
  	"settings_hide_on" "enum_pages_blocks_checklist_settings_hide_on" DEFAULT 'none',
  	"settings_anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"lede" varchar,
  	"source" "enum_pages_blocks_testimonials_source" DEFAULT 'latest',
  	"limit" numeric DEFAULT 3,
  	"show_rating" boolean DEFAULT true,
  	"settings_background" "enum_pages_blocks_testimonials_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_testimonials_settings_spacing" DEFAULT 'md',
  	"settings_hide_on" "enum_pages_blocks_testimonials_settings_hide_on" DEFAULT 'none',
  	"settings_anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"lede" varchar,
  	"settings_background" "enum_pages_blocks_faq_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_faq_settings_spacing" DEFAULT 'md',
  	"settings_hide_on" "enum_pages_blocks_faq_settings_hide_on" DEFAULT 'none',
  	"settings_anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_service_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"lede" varchar,
  	"link_to_pages" boolean DEFAULT true,
  	"settings_background" "enum_pages_blocks_service_areas_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_service_areas_settings_spacing" DEFAULT 'md',
  	"settings_hide_on" "enum_pages_blocks_service_areas_settings_hide_on" DEFAULT 'none',
  	"settings_anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"lede" varchar,
  	"columns" "enum_pages_blocks_gallery_columns" DEFAULT '3',
  	"settings_background" "enum_pages_blocks_gallery_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_gallery_settings_spacing" DEFAULT 'md',
  	"settings_hide_on" "enum_pages_blocks_gallery_settings_hide_on" DEFAULT 'none',
  	"settings_anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"lede" varchar,
  	"form_id" integer,
  	"show_info_card" boolean DEFAULT true,
  	"show_map" boolean DEFAULT false,
  	"footnote" varchar DEFAULT 'We reply within one business day.',
  	"settings_background" "enum_pages_blocks_contact_section_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_contact_section_settings_spacing" DEFAULT 'md',
  	"settings_hide_on" "enum_pages_blocks_contact_section_settings_hide_on" DEFAULT 'none',
  	"settings_anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"lede" varchar,
  	"show_phone" boolean DEFAULT true,
  	"button_label" varchar,
  	"button_url" varchar,
  	"style" "enum_pages_blocks_cta_band_style" DEFAULT 'gradient',
  	"image_id" integer,
  	"settings_background" "enum_pages_blocks_cta_band_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_cta_band_settings_spacing" DEFAULT 'md',
  	"settings_hide_on" "enum_pages_blocks_cta_band_settings_hide_on" DEFAULT 'none',
  	"settings_anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_pages_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum_pages_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_content_columns_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"caption" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum_pages_blocks_archive_populate_by" DEFAULT 'collection',
  	"relation_to" "enum_pages_blocks_archive_relation_to" DEFAULT 'posts',
  	"limit" numeric DEFAULT 10,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"hide_cta_band" boolean,
  	"published_at" timestamp(3) with time zone,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"services_id" integer,
  	"projects_id" integer,
  	"service_areas_id" integer,
  	"media_id" integer,
  	"testimonials_id" integer,
  	"faqs_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_hero_home_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_blocks_hero_home_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_hero_home_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_home_trust" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_home" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_hero_home_variant" DEFAULT 'split',
  	"show_logo" boolean DEFAULT true,
  	"heading" varchar,
  	"lede" varchar,
  	"image_id" integer,
  	"show_badge" boolean DEFAULT true,
  	"show_call_card" boolean DEFAULT true,
  	"call_card_text" varchar DEFAULT 'Call or text for a site visit',
  	"settings_background" "enum__pages_v_blocks_hero_home_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_hero_home_settings_spacing" DEFAULT 'md',
  	"settings_hide_on" "enum__pages_v_blocks_hero_home_settings_hide_on" DEFAULT 'none',
  	"settings_anchor" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_page_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_blocks_page_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_page_hero_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_page_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_page_hero_variant" DEFAULT 'split',
  	"show_breadcrumbs" boolean DEFAULT true,
  	"heading" varchar,
  	"lede" varchar,
  	"image_id" integer,
  	"settings_background" "enum__pages_v_blocks_page_hero_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_page_hero_settings_spacing" DEFAULT 'md',
  	"settings_hide_on" "enum__pages_v_blocks_page_hero_settings_hide_on" DEFAULT 'none',
  	"settings_anchor" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_services_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"lede" varchar,
  	"header_link_label" varchar,
  	"header_link_url" varchar,
  	"variant" "enum__pages_v_blocks_services_grid_variant" DEFAULT 'bento',
  	"source" "enum__pages_v_blocks_services_grid_source" DEFAULT 'all',
  	"link_to" "enum__pages_v_blocks_services_grid_link_to" DEFAULT 'service',
  	"settings_background" "enum__pages_v_blocks_services_grid_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_services_grid_settings_spacing" DEFAULT 'md',
  	"settings_hide_on" "enum__pages_v_blocks_services_grid_settings_hide_on" DEFAULT 'none',
  	"settings_anchor" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_featured_projects" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"lede" varchar,
  	"header_link_label" varchar,
  	"header_link_url" varchar,
  	"source" "enum__pages_v_blocks_featured_projects_source" DEFAULT 'latest',
  	"limit" numeric DEFAULT 3,
  	"filter_service_id" integer,
  	"settings_background" "enum__pages_v_blocks_featured_projects_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_featured_projects_settings_spacing" DEFAULT 'md',
  	"settings_hide_on" "enum__pages_v_blocks_featured_projects_settings_hide_on" DEFAULT 'none',
  	"settings_anchor" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_split_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_blocks_split_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_split_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"lede" varchar,
  	"body" jsonb,
  	"image_id" integer,
  	"image_position" "enum__pages_v_blocks_split_image_position" DEFAULT 'right',
  	"stamp_title" varchar,
  	"stamp_text" varchar,
  	"settings_background" "enum__pages_v_blocks_split_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_split_settings_spacing" DEFAULT 'md',
  	"settings_hide_on" "enum__pages_v_blocks_split_settings_hide_on" DEFAULT 'none',
  	"settings_anchor" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"icon" "enum__pages_v_blocks_cards_items_icon",
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"lede" varchar,
  	"header_link_label" varchar,
  	"header_link_url" varchar,
  	"variant" "enum__pages_v_blocks_cards_variant" DEFAULT 'value',
  	"columns" "enum__pages_v_blocks_cards_columns" DEFAULT '3',
  	"settings_background" "enum__pages_v_blocks_cards_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_cards_settings_spacing" DEFAULT 'md',
  	"settings_hide_on" "enum__pages_v_blocks_cards_settings_hide_on" DEFAULT 'none',
  	"settings_anchor" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"lede" varchar,
  	"settings_background" "enum__pages_v_blocks_steps_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_steps_settings_spacing" DEFAULT 'md',
  	"settings_hide_on" "enum__pages_v_blocks_steps_settings_hide_on" DEFAULT 'none',
  	"settings_anchor" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"lede" varchar,
  	"settings_background" "enum__pages_v_blocks_stats_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_stats_settings_spacing" DEFAULT 'md',
  	"settings_hide_on" "enum__pages_v_blocks_stats_settings_hide_on" DEFAULT 'none',
  	"settings_anchor" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_equipment_grid_categories" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_equipment_grid_categories",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_equipment_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"lede" varchar,
  	"show_filter" boolean DEFAULT true,
  	"settings_background" "enum__pages_v_blocks_equipment_grid_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_equipment_grid_settings_spacing" DEFAULT 'md',
  	"settings_hide_on" "enum__pages_v_blocks_equipment_grid_settings_hide_on" DEFAULT 'none',
  	"settings_anchor" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_checklist_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_checklist" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"lede" varchar,
  	"settings_background" "enum__pages_v_blocks_checklist_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_checklist_settings_spacing" DEFAULT 'md',
  	"settings_hide_on" "enum__pages_v_blocks_checklist_settings_hide_on" DEFAULT 'none',
  	"settings_anchor" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"lede" varchar,
  	"source" "enum__pages_v_blocks_testimonials_source" DEFAULT 'latest',
  	"limit" numeric DEFAULT 3,
  	"show_rating" boolean DEFAULT true,
  	"settings_background" "enum__pages_v_blocks_testimonials_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_testimonials_settings_spacing" DEFAULT 'md',
  	"settings_hide_on" "enum__pages_v_blocks_testimonials_settings_hide_on" DEFAULT 'none',
  	"settings_anchor" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"lede" varchar,
  	"settings_background" "enum__pages_v_blocks_faq_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_faq_settings_spacing" DEFAULT 'md',
  	"settings_hide_on" "enum__pages_v_blocks_faq_settings_hide_on" DEFAULT 'none',
  	"settings_anchor" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_service_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"lede" varchar,
  	"link_to_pages" boolean DEFAULT true,
  	"settings_background" "enum__pages_v_blocks_service_areas_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_service_areas_settings_spacing" DEFAULT 'md',
  	"settings_hide_on" "enum__pages_v_blocks_service_areas_settings_hide_on" DEFAULT 'none',
  	"settings_anchor" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"lede" varchar,
  	"columns" "enum__pages_v_blocks_gallery_columns" DEFAULT '3',
  	"settings_background" "enum__pages_v_blocks_gallery_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_gallery_settings_spacing" DEFAULT 'md',
  	"settings_hide_on" "enum__pages_v_blocks_gallery_settings_hide_on" DEFAULT 'none',
  	"settings_anchor" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"lede" varchar,
  	"form_id" integer,
  	"show_info_card" boolean DEFAULT true,
  	"show_map" boolean DEFAULT false,
  	"footnote" varchar DEFAULT 'We reply within one business day.',
  	"settings_background" "enum__pages_v_blocks_contact_section_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_contact_section_settings_spacing" DEFAULT 'md',
  	"settings_hide_on" "enum__pages_v_blocks_contact_section_settings_hide_on" DEFAULT 'none',
  	"settings_anchor" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"lede" varchar,
  	"show_phone" boolean DEFAULT true,
  	"button_label" varchar,
  	"button_url" varchar,
  	"style" "enum__pages_v_blocks_cta_band_style" DEFAULT 'gradient',
  	"image_id" integer,
  	"settings_background" "enum__pages_v_blocks_cta_band_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_cta_band_settings_spacing" DEFAULT 'md',
  	"settings_hide_on" "enum__pages_v_blocks_cta_band_settings_hide_on" DEFAULT 'none',
  	"settings_anchor" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__pages_v_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum__pages_v_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_content_columns_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"caption" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum__pages_v_blocks_archive_populate_by" DEFAULT 'collection',
  	"relation_to" "enum__pages_v_blocks_archive_relation_to" DEFAULT 'posts',
  	"limit" numeric DEFAULT 10,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"version_hide_cta_band" boolean,
  	"version_published_at" timestamp(3) with time zone,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"services_id" integer,
  	"projects_id" integer,
  	"service_areas_id" integer,
  	"media_id" integer,
  	"testimonials_id" integer,
  	"faqs_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "projects_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"summary" varchar,
  	"cover_id" integer,
  	"area_id" integer,
  	"client_type" "enum_projects_client_type" DEFAULT 'residential',
  	"lot_size" numeric,
  	"lot_unit" "enum_projects_lot_unit" DEFAULT 'acres',
  	"acres" numeric,
  	"completed_at" timestamp(3) with time zone,
  	"year" numeric,
  	"duration" varchar,
  	"featured" boolean,
  	"before_after_before_id" integer,
  	"before_after_after_id" integer,
  	"body" jsonb,
  	"testimonial_id" integer,
  	"location_note" varchar,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"published_at" timestamp(3) with time zone,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "projects_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer,
  	"equipment_id" integer
  );
  
  CREATE TABLE "_projects_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_cover_id" integer,
  	"version_area_id" integer,
  	"version_client_type" "enum__projects_v_version_client_type" DEFAULT 'residential',
  	"version_lot_size" numeric,
  	"version_lot_unit" "enum__projects_v_version_lot_unit" DEFAULT 'acres',
  	"version_acres" numeric,
  	"version_completed_at" timestamp(3) with time zone,
  	"version_year" numeric,
  	"version_duration" varchar,
  	"version_featured" boolean,
  	"version_before_after_before_id" integer,
  	"version_before_after_after_id" integer,
  	"version_body" jsonb,
  	"version_testimonial_id" integer,
  	"version_location_note" varchar,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_projects_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_projects_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer,
  	"equipment_id" integer
  );
  
  CREATE TABLE "services_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"icon" "enum_services_icon" DEFAULT 'excav',
  	"short_description" varchar NOT NULL,
  	"image_id" integer,
  	"body" jsonb,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"order" numeric DEFAULT 10,
  	"show_in_footer" boolean DEFAULT true,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "services_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"faqs_id" integer
  );
  
  CREATE TABLE "equipment_specs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "equipment" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"category" "enum_equipment_category" NOT NULL,
  	"icon" "enum_equipment_icon" DEFAULT 'fleetExcavator',
  	"spec" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"brand" varchar,
  	"model" varchar,
  	"quantity" numeric,
  	"order" numeric DEFAULT 10,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "service_areas" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"county" varchar,
  	"state" varchar DEFAULT 'DE',
  	"description" varchar,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"order" numeric DEFAULT 10,
  	"has_page" boolean DEFAULT true,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"author" varchar NOT NULL,
  	"location" varchar,
  	"rating" numeric DEFAULT 5 NOT NULL,
  	"quote" varchar NOT NULL,
  	"source" "enum_testimonials_source" DEFAULT 'direct',
  	"date" timestamp(3) with time zone,
  	"project_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"order" numeric DEFAULT 10,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "posts_populated_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"hero_image_id" integer,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"published_at" timestamp(3) with time zone,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer,
  	"categories_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "_posts_v_version_populated_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"name" varchar
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_hero_image_id" integer,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer,
  	"categories_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "categories_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"parent_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_medium_url" varchar,
  	"sizes_medium_width" numeric,
  	"sizes_medium_height" numeric,
  	"sizes_medium_mime_type" varchar,
  	"sizes_medium_filesize" numeric,
  	"sizes_medium_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to_type" "enum_redirects_to_type" DEFAULT 'reference',
  	"to_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"projects_id" integer,
  	"services_id" integer
  );
  
  CREATE TABLE "forms_blocks_checkbox" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"default_value" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_country" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_email" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_message" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"message" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_number" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_select_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"placeholder" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_state" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_textarea" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email_to" varchar,
  	"cc" varchar,
  	"bcc" varchar,
  	"reply_to" varchar,
  	"email_from" varchar,
  	"subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL,
  	"message" jsonb
  );
  
  CREATE TABLE "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"submit_button_label" varchar,
  	"confirmation_type" "enum_forms_confirmation_type" DEFAULT 'message',
  	"confirmation_message" jsonb,
  	"redirect_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "form_submissions_submission_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"status" "enum_form_submissions_status" DEFAULT 'new',
  	"notes" varchar,
  	"source_page" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "search_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"relation_to" varchar,
  	"category_i_d" varchar,
  	"title" varchar
  );
  
  CREATE TABLE "search" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"priority" numeric,
  	"slug" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "search_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer,
  	"projects_id" integer,
  	"services_id" integer,
  	"pages_id" integer
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_folders_folder_type" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_payload_folders_folder_type",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload_folders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"projects_id" integer,
  	"services_id" integer,
  	"equipment_id" integer,
  	"service_areas_id" integer,
  	"testimonials_id" integer,
  	"faqs_id" integer,
  	"posts_id" integer,
  	"categories_id" integer,
  	"media_id" integer,
  	"users_id" integer,
  	"redirects_id" integer,
  	"forms_id" integer,
  	"form_submissions_id" integer,
  	"search_id" integer,
  	"payload_folders_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_settings_socials_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"company_name" varchar NOT NULL,
  	"short_name" varchar,
  	"tagline" varchar,
  	"description" varchar,
  	"phone" varchar,
  	"sms_phone" varchar,
  	"email" varchar,
  	"address_street" varchar,
  	"address_city" varchar,
  	"address_state" varchar,
  	"address_zip" varchar,
  	"address_map_url" varchar,
  	"hours" varchar,
  	"service_area_text" varchar,
  	"license_number" varchar,
  	"logo_id" integer,
  	"logo_on_dark_id" integer,
  	"logo_mark_id" integer,
  	"favicon_id" integer,
  	"logo_height" numeric DEFAULT 44,
  	"announcement_enabled" boolean,
  	"announcement_text" varchar,
  	"announcement_link_label" varchar,
  	"announcement_link_url" varchar,
  	"cta_band_enabled" boolean DEFAULT true,
  	"cta_band_heading" varchar DEFAULT 'Have a lot that needs work?',
  	"cta_band_show_phone" boolean DEFAULT true,
  	"cta_band_button_label" varchar DEFAULT 'Request a free estimate',
  	"cta_band_button_url" varchar DEFAULT '/contact',
  	"mobile_call_bar" boolean DEFAULT true,
  	"back_to_top" boolean DEFAULT true,
  	"title_suffix" varchar,
  	"default_og_image_id" integer,
  	"business_type" "enum_site_settings_business_type" DEFAULT 'GeneralContractor',
  	"plausible_domain" varchar,
  	"ga_id" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "theme" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"preset" "enum_theme_preset" DEFAULT 'classic' NOT NULL,
  	"colors_primary" varchar,
  	"colors_primary_hover" varchar,
  	"colors_primary_deep" varchar,
  	"colors_accent" varchar,
  	"colors_heading" varchar,
  	"colors_text" varchar,
  	"colors_muted" varchar,
  	"colors_background" varchar,
  	"colors_alt" varchar,
  	"colors_tint" varchar,
  	"colors_surface" varchar,
  	"colors_line" varchar,
  	"colors_dark" varchar,
  	"colors_on_dark" varchar,
  	"font_display" "enum_theme_font_display" DEFAULT 'preset',
  	"font_body" "enum_theme_font_body" DEFAULT 'preset',
  	"heading_case" "enum_theme_heading_case" DEFAULT 'preset',
  	"base_font_size" numeric,
  	"radius" "enum_theme_radius" DEFAULT 'preset',
  	"button_shape" "enum_theme_button_shape" DEFAULT 'preset',
  	"card_style" "enum_theme_card_style" DEFAULT 'preset',
  	"container" "enum_theme_container" DEFAULT 'preset',
  	"header_style" "enum_theme_header_style" DEFAULT 'preset',
  	"footer_style" "enum_theme_footer_style" DEFAULT 'preset',
  	"sticky_header" boolean DEFAULT true,
  	"animations" boolean DEFAULT true,
  	"custom_css" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "header_nav_items_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_header_nav_items_children_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE "header_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_header_nav_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"show_phone" boolean DEFAULT true,
  	"cta_label" varchar,
  	"cta_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "header_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"services_id" integer,
  	"projects_id" integer,
  	"service_areas_id" integer
  );
  
  CREATE TABLE "footer_columns_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_columns_nav_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE "footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "footer_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_legal_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"show_services" boolean DEFAULT true,
  	"services_title" varchar DEFAULT 'Services',
  	"show_contact" boolean DEFAULT true,
  	"bottom_text" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"services_id" integer,
  	"projects_id" integer,
  	"service_areas_id" integer
  );
  
  CREATE TABLE "listing_pages_projects_filters" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_listing_pages_projects_filters",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "listing_pages_projects_size_buckets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"min" numeric DEFAULT 0,
  	"max" numeric
  );
  
  CREATE TABLE "listing_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"projects_heading" varchar DEFAULT 'Finished *projects*',
  	"projects_lede" varchar DEFAULT 'Find work similar to yours. Filter by service, lot size or town.',
  	"projects_image_id" integer,
  	"projects_per_page" numeric DEFAULT 12,
  	"projects_detail_cta_label" varchar DEFAULT 'Get an estimate for a similar job',
  	"services_heading" varchar DEFAULT 'Our *services*',
  	"services_lede" varchar DEFAULT 'Hire us for one service or the whole job, from raw land to finished site.',
  	"services_image_id" integer,
  	"posts_heading" varchar DEFAULT 'News & *tips*',
  	"posts_lede" varchar DEFAULT 'Project updates and practical advice for property owners.',
  	"posts_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "pages_blocks_hero_home_links" ADD CONSTRAINT "pages_blocks_hero_home_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_home_trust" ADD CONSTRAINT "pages_blocks_hero_home_trust_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_home" ADD CONSTRAINT "pages_blocks_hero_home_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_home" ADD CONSTRAINT "pages_blocks_hero_home_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_page_hero_links" ADD CONSTRAINT "pages_blocks_page_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_page_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_page_hero" ADD CONSTRAINT "pages_blocks_page_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_page_hero" ADD CONSTRAINT "pages_blocks_page_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_services_grid" ADD CONSTRAINT "pages_blocks_services_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_featured_projects" ADD CONSTRAINT "pages_blocks_featured_projects_filter_service_id_services_id_fk" FOREIGN KEY ("filter_service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_featured_projects" ADD CONSTRAINT "pages_blocks_featured_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_split_links" ADD CONSTRAINT "pages_blocks_split_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_split" ADD CONSTRAINT "pages_blocks_split_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_split" ADD CONSTRAINT "pages_blocks_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cards_items" ADD CONSTRAINT "pages_blocks_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cards" ADD CONSTRAINT "pages_blocks_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_steps_steps" ADD CONSTRAINT "pages_blocks_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_steps" ADD CONSTRAINT "pages_blocks_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_items" ADD CONSTRAINT "pages_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats" ADD CONSTRAINT "pages_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_equipment_grid_categories" ADD CONSTRAINT "pages_blocks_equipment_grid_categories_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_equipment_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_equipment_grid" ADD CONSTRAINT "pages_blocks_equipment_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_checklist_items" ADD CONSTRAINT "pages_blocks_checklist_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_checklist"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_checklist" ADD CONSTRAINT "pages_blocks_checklist_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_service_areas" ADD CONSTRAINT "pages_blocks_service_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery" ADD CONSTRAINT "pages_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_section" ADD CONSTRAINT "pages_blocks_contact_section_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_section" ADD CONSTRAINT "pages_blocks_contact_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_band" ADD CONSTRAINT "pages_blocks_cta_band_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_band" ADD CONSTRAINT "pages_blocks_cta_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_columns" ADD CONSTRAINT "pages_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content" ADD CONSTRAINT "pages_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_block" ADD CONSTRAINT "pages_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_block" ADD CONSTRAINT "pages_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_block" ADD CONSTRAINT "pages_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_block" ADD CONSTRAINT "pages_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_archive" ADD CONSTRAINT "pages_blocks_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_service_areas_fk" FOREIGN KEY ("service_areas_id") REFERENCES "public"."service_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_home_links" ADD CONSTRAINT "_pages_v_blocks_hero_home_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero_home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_home_trust" ADD CONSTRAINT "_pages_v_blocks_hero_home_trust_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero_home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_home" ADD CONSTRAINT "_pages_v_blocks_hero_home_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_home" ADD CONSTRAINT "_pages_v_blocks_hero_home_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_hero_links" ADD CONSTRAINT "_pages_v_blocks_page_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_page_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_hero" ADD CONSTRAINT "_pages_v_blocks_page_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_hero" ADD CONSTRAINT "_pages_v_blocks_page_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_services_grid" ADD CONSTRAINT "_pages_v_blocks_services_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_featured_projects" ADD CONSTRAINT "_pages_v_blocks_featured_projects_filter_service_id_services_id_fk" FOREIGN KEY ("filter_service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_featured_projects" ADD CONSTRAINT "_pages_v_blocks_featured_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split_links" ADD CONSTRAINT "_pages_v_blocks_split_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split" ADD CONSTRAINT "_pages_v_blocks_split_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split" ADD CONSTRAINT "_pages_v_blocks_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cards_items" ADD CONSTRAINT "_pages_v_blocks_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cards" ADD CONSTRAINT "_pages_v_blocks_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_steps_steps" ADD CONSTRAINT "_pages_v_blocks_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_steps" ADD CONSTRAINT "_pages_v_blocks_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_items" ADD CONSTRAINT "_pages_v_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats" ADD CONSTRAINT "_pages_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_equipment_grid_categories" ADD CONSTRAINT "_pages_v_blocks_equipment_grid_categories_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_equipment_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_equipment_grid" ADD CONSTRAINT "_pages_v_blocks_equipment_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_checklist_items" ADD CONSTRAINT "_pages_v_blocks_checklist_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_checklist"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_checklist" ADD CONSTRAINT "_pages_v_blocks_checklist_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_service_areas" ADD CONSTRAINT "_pages_v_blocks_service_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gallery" ADD CONSTRAINT "_pages_v_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_section" ADD CONSTRAINT "_pages_v_blocks_contact_section_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_section" ADD CONSTRAINT "_pages_v_blocks_contact_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_band" ADD CONSTRAINT "_pages_v_blocks_cta_band_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_band" ADD CONSTRAINT "_pages_v_blocks_cta_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_columns" ADD CONSTRAINT "_pages_v_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content" ADD CONSTRAINT "_pages_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_block" ADD CONSTRAINT "_pages_v_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_block" ADD CONSTRAINT "_pages_v_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_block" ADD CONSTRAINT "_pages_v_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_block" ADD CONSTRAINT "_pages_v_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_archive" ADD CONSTRAINT "_pages_v_blocks_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_service_areas_fk" FOREIGN KEY ("service_areas_id") REFERENCES "public"."service_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_gallery" ADD CONSTRAINT "projects_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_gallery" ADD CONSTRAINT "projects_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_area_id_service_areas_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."service_areas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_before_after_before_id_media_id_fk" FOREIGN KEY ("before_after_before_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_before_after_after_id_media_id_fk" FOREIGN KEY ("before_after_after_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_testimonial_id_testimonials_id_fk" FOREIGN KEY ("testimonial_id") REFERENCES "public"."testimonials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_texts" ADD CONSTRAINT "projects_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_equipment_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_gallery" ADD CONSTRAINT "_projects_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_version_gallery" ADD CONSTRAINT "_projects_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_area_id_service_areas_id_fk" FOREIGN KEY ("version_area_id") REFERENCES "public"."service_areas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_before_after_before_id_media_id_fk" FOREIGN KEY ("version_before_after_before_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_before_after_after_id_media_id_fk" FOREIGN KEY ("version_before_after_after_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_testimonial_id_testimonials_id_fk" FOREIGN KEY ("version_testimonial_id") REFERENCES "public"."testimonials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_texts" ADD CONSTRAINT "_projects_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_equipment_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_highlights" ADD CONSTRAINT "services_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "equipment_specs" ADD CONSTRAINT "equipment_specs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."equipment"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "equipment" ADD CONSTRAINT "equipment_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_areas" ADD CONSTRAINT "service_areas_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_populated_authors" ADD CONSTRAINT "posts_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_populated_authors" ADD CONSTRAINT "_posts_v_version_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_breadcrumbs" ADD CONSTRAINT "categories_breadcrumbs_doc_id_categories_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_breadcrumbs" ADD CONSTRAINT "categories_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox" ADD CONSTRAINT "forms_blocks_checkbox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_country" ADD CONSTRAINT "forms_blocks_country_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email" ADD CONSTRAINT "forms_blocks_email_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message" ADD CONSTRAINT "forms_blocks_message_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number" ADD CONSTRAINT "forms_blocks_number_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options" ADD CONSTRAINT "forms_blocks_select_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select" ADD CONSTRAINT "forms_blocks_select_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_state" ADD CONSTRAINT "forms_blocks_state_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text" ADD CONSTRAINT "forms_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea" ADD CONSTRAINT "forms_blocks_textarea_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails" ADD CONSTRAINT "forms_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions_submission_data" ADD CONSTRAINT "form_submissions_submission_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_categories" ADD CONSTRAINT "search_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search" ADD CONSTRAINT "search_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders_folder_type" ADD CONSTRAINT "payload_folders_folder_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders" ADD CONSTRAINT "payload_folders_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_equipment_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_service_areas_fk" FOREIGN KEY ("service_areas_id") REFERENCES "public"."service_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_search_fk" FOREIGN KEY ("search_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_folders_fk" FOREIGN KEY ("payload_folders_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_socials" ADD CONSTRAINT "site_settings_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_on_dark_id_media_id_fk" FOREIGN KEY ("logo_on_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_mark_id_media_id_fk" FOREIGN KEY ("logo_mark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_default_og_image_id_media_id_fk" FOREIGN KEY ("default_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_nav_items_children" ADD CONSTRAINT "header_nav_items_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_service_areas_fk" FOREIGN KEY ("service_areas_id") REFERENCES "public"."service_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_nav_items" ADD CONSTRAINT "footer_columns_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns" ADD CONSTRAINT "footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_legal_links" ADD CONSTRAINT "footer_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_service_areas_fk" FOREIGN KEY ("service_areas_id") REFERENCES "public"."service_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "listing_pages_projects_filters" ADD CONSTRAINT "listing_pages_projects_filters_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."listing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "listing_pages_projects_size_buckets" ADD CONSTRAINT "listing_pages_projects_size_buckets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."listing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "listing_pages" ADD CONSTRAINT "listing_pages_projects_image_id_media_id_fk" FOREIGN KEY ("projects_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "listing_pages" ADD CONSTRAINT "listing_pages_services_image_id_media_id_fk" FOREIGN KEY ("services_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "listing_pages" ADD CONSTRAINT "listing_pages_posts_image_id_media_id_fk" FOREIGN KEY ("posts_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_home_links_order_idx" ON "pages_blocks_hero_home_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_home_links_parent_id_idx" ON "pages_blocks_hero_home_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_home_trust_order_idx" ON "pages_blocks_hero_home_trust" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_home_trust_parent_id_idx" ON "pages_blocks_hero_home_trust" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_home_order_idx" ON "pages_blocks_hero_home" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_home_parent_id_idx" ON "pages_blocks_hero_home" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_home_path_idx" ON "pages_blocks_hero_home" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_home_image_idx" ON "pages_blocks_hero_home" USING btree ("image_id");
  CREATE INDEX "pages_blocks_page_hero_links_order_idx" ON "pages_blocks_page_hero_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_page_hero_links_parent_id_idx" ON "pages_blocks_page_hero_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_page_hero_order_idx" ON "pages_blocks_page_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_page_hero_parent_id_idx" ON "pages_blocks_page_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_page_hero_path_idx" ON "pages_blocks_page_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_page_hero_image_idx" ON "pages_blocks_page_hero" USING btree ("image_id");
  CREATE INDEX "pages_blocks_services_grid_order_idx" ON "pages_blocks_services_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_services_grid_parent_id_idx" ON "pages_blocks_services_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_services_grid_path_idx" ON "pages_blocks_services_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_featured_projects_order_idx" ON "pages_blocks_featured_projects" USING btree ("_order");
  CREATE INDEX "pages_blocks_featured_projects_parent_id_idx" ON "pages_blocks_featured_projects" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_featured_projects_path_idx" ON "pages_blocks_featured_projects" USING btree ("_path");
  CREATE INDEX "pages_blocks_featured_projects_filter_service_idx" ON "pages_blocks_featured_projects" USING btree ("filter_service_id");
  CREATE INDEX "pages_blocks_split_links_order_idx" ON "pages_blocks_split_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_split_links_parent_id_idx" ON "pages_blocks_split_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_split_order_idx" ON "pages_blocks_split" USING btree ("_order");
  CREATE INDEX "pages_blocks_split_parent_id_idx" ON "pages_blocks_split" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_split_path_idx" ON "pages_blocks_split" USING btree ("_path");
  CREATE INDEX "pages_blocks_split_image_idx" ON "pages_blocks_split" USING btree ("image_id");
  CREATE INDEX "pages_blocks_cards_items_order_idx" ON "pages_blocks_cards_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_cards_items_parent_id_idx" ON "pages_blocks_cards_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cards_order_idx" ON "pages_blocks_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_cards_parent_id_idx" ON "pages_blocks_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cards_path_idx" ON "pages_blocks_cards" USING btree ("_path");
  CREATE INDEX "pages_blocks_steps_steps_order_idx" ON "pages_blocks_steps_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_steps_steps_parent_id_idx" ON "pages_blocks_steps_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_steps_order_idx" ON "pages_blocks_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_steps_parent_id_idx" ON "pages_blocks_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_steps_path_idx" ON "pages_blocks_steps" USING btree ("_path");
  CREATE INDEX "pages_blocks_stats_items_order_idx" ON "pages_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_items_parent_id_idx" ON "pages_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_order_idx" ON "pages_blocks_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_parent_id_idx" ON "pages_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_path_idx" ON "pages_blocks_stats" USING btree ("_path");
  CREATE INDEX "pages_blocks_equipment_grid_categories_order_idx" ON "pages_blocks_equipment_grid_categories" USING btree ("order");
  CREATE INDEX "pages_blocks_equipment_grid_categories_parent_idx" ON "pages_blocks_equipment_grid_categories" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_equipment_grid_order_idx" ON "pages_blocks_equipment_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_equipment_grid_parent_id_idx" ON "pages_blocks_equipment_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_equipment_grid_path_idx" ON "pages_blocks_equipment_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_checklist_items_order_idx" ON "pages_blocks_checklist_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_checklist_items_parent_id_idx" ON "pages_blocks_checklist_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_checklist_order_idx" ON "pages_blocks_checklist" USING btree ("_order");
  CREATE INDEX "pages_blocks_checklist_parent_id_idx" ON "pages_blocks_checklist" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_checklist_path_idx" ON "pages_blocks_checklist" USING btree ("_path");
  CREATE INDEX "pages_blocks_testimonials_order_idx" ON "pages_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_parent_id_idx" ON "pages_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_path_idx" ON "pages_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE INDEX "pages_blocks_service_areas_order_idx" ON "pages_blocks_service_areas" USING btree ("_order");
  CREATE INDEX "pages_blocks_service_areas_parent_id_idx" ON "pages_blocks_service_areas" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_service_areas_path_idx" ON "pages_blocks_service_areas" USING btree ("_path");
  CREATE INDEX "pages_blocks_gallery_order_idx" ON "pages_blocks_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_parent_id_idx" ON "pages_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_path_idx" ON "pages_blocks_gallery" USING btree ("_path");
  CREATE INDEX "pages_blocks_contact_section_order_idx" ON "pages_blocks_contact_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_section_parent_id_idx" ON "pages_blocks_contact_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_section_path_idx" ON "pages_blocks_contact_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_contact_section_form_idx" ON "pages_blocks_contact_section" USING btree ("form_id");
  CREATE INDEX "pages_blocks_cta_band_order_idx" ON "pages_blocks_cta_band" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_band_parent_id_idx" ON "pages_blocks_cta_band" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_band_path_idx" ON "pages_blocks_cta_band" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_band_image_idx" ON "pages_blocks_cta_band" USING btree ("image_id");
  CREATE INDEX "pages_blocks_content_columns_order_idx" ON "pages_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_columns_parent_id_idx" ON "pages_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_order_idx" ON "pages_blocks_content" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_parent_id_idx" ON "pages_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_path_idx" ON "pages_blocks_content" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_block_order_idx" ON "pages_blocks_media_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_block_parent_id_idx" ON "pages_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_media_block_path_idx" ON "pages_blocks_media_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_block_media_idx" ON "pages_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "pages_blocks_form_block_order_idx" ON "pages_blocks_form_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_block_parent_id_idx" ON "pages_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_block_path_idx" ON "pages_blocks_form_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_form_block_form_idx" ON "pages_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "pages_blocks_archive_order_idx" ON "pages_blocks_archive" USING btree ("_order");
  CREATE INDEX "pages_blocks_archive_parent_id_idx" ON "pages_blocks_archive" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_archive_path_idx" ON "pages_blocks_archive" USING btree ("_path");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_pages_id_idx" ON "pages_rels" USING btree ("pages_id");
  CREATE INDEX "pages_rels_posts_id_idx" ON "pages_rels" USING btree ("posts_id");
  CREATE INDEX "pages_rels_services_id_idx" ON "pages_rels" USING btree ("services_id");
  CREATE INDEX "pages_rels_projects_id_idx" ON "pages_rels" USING btree ("projects_id");
  CREATE INDEX "pages_rels_service_areas_id_idx" ON "pages_rels" USING btree ("service_areas_id");
  CREATE INDEX "pages_rels_media_id_idx" ON "pages_rels" USING btree ("media_id");
  CREATE INDEX "pages_rels_testimonials_id_idx" ON "pages_rels" USING btree ("testimonials_id");
  CREATE INDEX "pages_rels_faqs_id_idx" ON "pages_rels" USING btree ("faqs_id");
  CREATE INDEX "pages_rels_categories_id_idx" ON "pages_rels" USING btree ("categories_id");
  CREATE INDEX "_pages_v_blocks_hero_home_links_order_idx" ON "_pages_v_blocks_hero_home_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_home_links_parent_id_idx" ON "_pages_v_blocks_hero_home_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_home_trust_order_idx" ON "_pages_v_blocks_hero_home_trust" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_home_trust_parent_id_idx" ON "_pages_v_blocks_hero_home_trust" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_home_order_idx" ON "_pages_v_blocks_hero_home" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_home_parent_id_idx" ON "_pages_v_blocks_hero_home" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_home_path_idx" ON "_pages_v_blocks_hero_home" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_home_image_idx" ON "_pages_v_blocks_hero_home" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_page_hero_links_order_idx" ON "_pages_v_blocks_page_hero_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_page_hero_links_parent_id_idx" ON "_pages_v_blocks_page_hero_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_page_hero_order_idx" ON "_pages_v_blocks_page_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_page_hero_parent_id_idx" ON "_pages_v_blocks_page_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_page_hero_path_idx" ON "_pages_v_blocks_page_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_page_hero_image_idx" ON "_pages_v_blocks_page_hero" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_services_grid_order_idx" ON "_pages_v_blocks_services_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_services_grid_parent_id_idx" ON "_pages_v_blocks_services_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_services_grid_path_idx" ON "_pages_v_blocks_services_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_featured_projects_order_idx" ON "_pages_v_blocks_featured_projects" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_featured_projects_parent_id_idx" ON "_pages_v_blocks_featured_projects" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_featured_projects_path_idx" ON "_pages_v_blocks_featured_projects" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_featured_projects_filter_service_idx" ON "_pages_v_blocks_featured_projects" USING btree ("filter_service_id");
  CREATE INDEX "_pages_v_blocks_split_links_order_idx" ON "_pages_v_blocks_split_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_split_links_parent_id_idx" ON "_pages_v_blocks_split_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_split_order_idx" ON "_pages_v_blocks_split" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_split_parent_id_idx" ON "_pages_v_blocks_split" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_split_path_idx" ON "_pages_v_blocks_split" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_split_image_idx" ON "_pages_v_blocks_split" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_cards_items_order_idx" ON "_pages_v_blocks_cards_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cards_items_parent_id_idx" ON "_pages_v_blocks_cards_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cards_order_idx" ON "_pages_v_blocks_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cards_parent_id_idx" ON "_pages_v_blocks_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cards_path_idx" ON "_pages_v_blocks_cards" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_steps_steps_order_idx" ON "_pages_v_blocks_steps_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_steps_steps_parent_id_idx" ON "_pages_v_blocks_steps_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_steps_order_idx" ON "_pages_v_blocks_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_steps_parent_id_idx" ON "_pages_v_blocks_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_steps_path_idx" ON "_pages_v_blocks_steps" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_stats_items_order_idx" ON "_pages_v_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_items_parent_id_idx" ON "_pages_v_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_order_idx" ON "_pages_v_blocks_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_parent_id_idx" ON "_pages_v_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_path_idx" ON "_pages_v_blocks_stats" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_equipment_grid_categories_order_idx" ON "_pages_v_blocks_equipment_grid_categories" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_equipment_grid_categories_parent_idx" ON "_pages_v_blocks_equipment_grid_categories" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_equipment_grid_order_idx" ON "_pages_v_blocks_equipment_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_equipment_grid_parent_id_idx" ON "_pages_v_blocks_equipment_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_equipment_grid_path_idx" ON "_pages_v_blocks_equipment_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_checklist_items_order_idx" ON "_pages_v_blocks_checklist_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_checklist_items_parent_id_idx" ON "_pages_v_blocks_checklist_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_checklist_order_idx" ON "_pages_v_blocks_checklist" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_checklist_parent_id_idx" ON "_pages_v_blocks_checklist" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_checklist_path_idx" ON "_pages_v_blocks_checklist" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_testimonials_order_idx" ON "_pages_v_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_parent_id_idx" ON "_pages_v_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_path_idx" ON "_pages_v_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faq_order_idx" ON "_pages_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_parent_id_idx" ON "_pages_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_path_idx" ON "_pages_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_service_areas_order_idx" ON "_pages_v_blocks_service_areas" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_service_areas_parent_id_idx" ON "_pages_v_blocks_service_areas" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_service_areas_path_idx" ON "_pages_v_blocks_service_areas" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_gallery_order_idx" ON "_pages_v_blocks_gallery" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gallery_parent_id_idx" ON "_pages_v_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gallery_path_idx" ON "_pages_v_blocks_gallery" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_contact_section_order_idx" ON "_pages_v_blocks_contact_section" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_section_parent_id_idx" ON "_pages_v_blocks_contact_section" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_section_path_idx" ON "_pages_v_blocks_contact_section" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_contact_section_form_idx" ON "_pages_v_blocks_contact_section" USING btree ("form_id");
  CREATE INDEX "_pages_v_blocks_cta_band_order_idx" ON "_pages_v_blocks_cta_band" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_band_parent_id_idx" ON "_pages_v_blocks_cta_band" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_band_path_idx" ON "_pages_v_blocks_cta_band" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_band_image_idx" ON "_pages_v_blocks_cta_band" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_content_columns_order_idx" ON "_pages_v_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_columns_parent_id_idx" ON "_pages_v_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_order_idx" ON "_pages_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_parent_id_idx" ON "_pages_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_path_idx" ON "_pages_v_blocks_content" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_block_order_idx" ON "_pages_v_blocks_media_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_media_block_parent_id_idx" ON "_pages_v_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_media_block_path_idx" ON "_pages_v_blocks_media_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_block_media_idx" ON "_pages_v_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_form_block_order_idx" ON "_pages_v_blocks_form_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_form_block_parent_id_idx" ON "_pages_v_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_form_block_path_idx" ON "_pages_v_blocks_form_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_form_block_form_idx" ON "_pages_v_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "_pages_v_blocks_archive_order_idx" ON "_pages_v_blocks_archive" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_archive_parent_id_idx" ON "_pages_v_blocks_archive" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_archive_path_idx" ON "_pages_v_blocks_archive" USING btree ("_path");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_pages_id_idx" ON "_pages_v_rels" USING btree ("pages_id");
  CREATE INDEX "_pages_v_rels_posts_id_idx" ON "_pages_v_rels" USING btree ("posts_id");
  CREATE INDEX "_pages_v_rels_services_id_idx" ON "_pages_v_rels" USING btree ("services_id");
  CREATE INDEX "_pages_v_rels_projects_id_idx" ON "_pages_v_rels" USING btree ("projects_id");
  CREATE INDEX "_pages_v_rels_service_areas_id_idx" ON "_pages_v_rels" USING btree ("service_areas_id");
  CREATE INDEX "_pages_v_rels_media_id_idx" ON "_pages_v_rels" USING btree ("media_id");
  CREATE INDEX "_pages_v_rels_testimonials_id_idx" ON "_pages_v_rels" USING btree ("testimonials_id");
  CREATE INDEX "_pages_v_rels_faqs_id_idx" ON "_pages_v_rels" USING btree ("faqs_id");
  CREATE INDEX "_pages_v_rels_categories_id_idx" ON "_pages_v_rels" USING btree ("categories_id");
  CREATE INDEX "projects_gallery_order_idx" ON "projects_gallery" USING btree ("_order");
  CREATE INDEX "projects_gallery_parent_id_idx" ON "projects_gallery" USING btree ("_parent_id");
  CREATE INDEX "projects_gallery_image_idx" ON "projects_gallery" USING btree ("image_id");
  CREATE INDEX "projects_cover_idx" ON "projects" USING btree ("cover_id");
  CREATE INDEX "projects_area_idx" ON "projects" USING btree ("area_id");
  CREATE INDEX "projects_acres_idx" ON "projects" USING btree ("acres");
  CREATE INDEX "projects_completed_at_idx" ON "projects" USING btree ("completed_at");
  CREATE INDEX "projects_year_idx" ON "projects" USING btree ("year");
  CREATE INDEX "projects_before_after_before_after_before_idx" ON "projects" USING btree ("before_after_before_id");
  CREATE INDEX "projects_before_after_before_after_after_idx" ON "projects" USING btree ("before_after_after_id");
  CREATE INDEX "projects_testimonial_idx" ON "projects" USING btree ("testimonial_id");
  CREATE INDEX "projects_meta_meta_image_idx" ON "projects" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "projects__status_idx" ON "projects" USING btree ("_status");
  CREATE INDEX "projects_texts_order_parent" ON "projects_texts" USING btree ("order","parent_id");
  CREATE INDEX "projects_rels_order_idx" ON "projects_rels" USING btree ("order");
  CREATE INDEX "projects_rels_parent_idx" ON "projects_rels" USING btree ("parent_id");
  CREATE INDEX "projects_rels_path_idx" ON "projects_rels" USING btree ("path");
  CREATE INDEX "projects_rels_services_id_idx" ON "projects_rels" USING btree ("services_id");
  CREATE INDEX "projects_rels_equipment_id_idx" ON "projects_rels" USING btree ("equipment_id");
  CREATE INDEX "_projects_v_version_gallery_order_idx" ON "_projects_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_projects_v_version_gallery_parent_id_idx" ON "_projects_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_gallery_image_idx" ON "_projects_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version_cover_idx" ON "_projects_v" USING btree ("version_cover_id");
  CREATE INDEX "_projects_v_version_version_area_idx" ON "_projects_v" USING btree ("version_area_id");
  CREATE INDEX "_projects_v_version_version_acres_idx" ON "_projects_v" USING btree ("version_acres");
  CREATE INDEX "_projects_v_version_version_completed_at_idx" ON "_projects_v" USING btree ("version_completed_at");
  CREATE INDEX "_projects_v_version_version_year_idx" ON "_projects_v" USING btree ("version_year");
  CREATE INDEX "_projects_v_version_before_after_version_before_after_be_idx" ON "_projects_v" USING btree ("version_before_after_before_id");
  CREATE INDEX "_projects_v_version_before_after_version_before_after_af_idx" ON "_projects_v" USING btree ("version_before_after_after_id");
  CREATE INDEX "_projects_v_version_version_testimonial_idx" ON "_projects_v" USING btree ("version_testimonial_id");
  CREATE INDEX "_projects_v_version_meta_version_meta_image_idx" ON "_projects_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "_projects_v" USING btree ("version_slug");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_latest_idx" ON "_projects_v" USING btree ("latest");
  CREATE INDEX "_projects_v_autosave_idx" ON "_projects_v" USING btree ("autosave");
  CREATE INDEX "_projects_v_texts_order_parent" ON "_projects_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_projects_v_rels_order_idx" ON "_projects_v_rels" USING btree ("order");
  CREATE INDEX "_projects_v_rels_parent_idx" ON "_projects_v_rels" USING btree ("parent_id");
  CREATE INDEX "_projects_v_rels_path_idx" ON "_projects_v_rels" USING btree ("path");
  CREATE INDEX "_projects_v_rels_services_id_idx" ON "_projects_v_rels" USING btree ("services_id");
  CREATE INDEX "_projects_v_rels_equipment_id_idx" ON "_projects_v_rels" USING btree ("equipment_id");
  CREATE INDEX "services_highlights_order_idx" ON "services_highlights" USING btree ("_order");
  CREATE INDEX "services_highlights_parent_id_idx" ON "services_highlights" USING btree ("_parent_id");
  CREATE INDEX "services_image_idx" ON "services" USING btree ("image_id");
  CREATE INDEX "services_meta_meta_image_idx" ON "services" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "services_rels_order_idx" ON "services_rels" USING btree ("order");
  CREATE INDEX "services_rels_parent_idx" ON "services_rels" USING btree ("parent_id");
  CREATE INDEX "services_rels_path_idx" ON "services_rels" USING btree ("path");
  CREATE INDEX "services_rels_faqs_id_idx" ON "services_rels" USING btree ("faqs_id");
  CREATE INDEX "equipment_specs_order_idx" ON "equipment_specs" USING btree ("_order");
  CREATE INDEX "equipment_specs_parent_id_idx" ON "equipment_specs" USING btree ("_parent_id");
  CREATE INDEX "equipment_image_idx" ON "equipment" USING btree ("image_id");
  CREATE INDEX "equipment_updated_at_idx" ON "equipment" USING btree ("updated_at");
  CREATE INDEX "equipment_created_at_idx" ON "equipment" USING btree ("created_at");
  CREATE INDEX "service_areas_meta_meta_image_idx" ON "service_areas" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "service_areas_slug_idx" ON "service_areas" USING btree ("slug");
  CREATE INDEX "service_areas_updated_at_idx" ON "service_areas" USING btree ("updated_at");
  CREATE INDEX "service_areas_created_at_idx" ON "service_areas" USING btree ("created_at");
  CREATE INDEX "testimonials_project_idx" ON "testimonials" USING btree ("project_id");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE INDEX "posts_populated_authors_order_idx" ON "posts_populated_authors" USING btree ("_order");
  CREATE INDEX "posts_populated_authors_parent_id_idx" ON "posts_populated_authors" USING btree ("_parent_id");
  CREATE INDEX "posts_hero_image_idx" ON "posts" USING btree ("hero_image_id");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_posts_id_idx" ON "posts_rels" USING btree ("posts_id");
  CREATE INDEX "posts_rels_categories_id_idx" ON "posts_rels" USING btree ("categories_id");
  CREATE INDEX "posts_rels_users_id_idx" ON "posts_rels" USING btree ("users_id");
  CREATE INDEX "_posts_v_version_populated_authors_order_idx" ON "_posts_v_version_populated_authors" USING btree ("_order");
  CREATE INDEX "_posts_v_version_populated_authors_parent_id_idx" ON "_posts_v_version_populated_authors" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_hero_image_idx" ON "_posts_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_autosave_idx" ON "_posts_v" USING btree ("autosave");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_posts_id_idx" ON "_posts_v_rels" USING btree ("posts_id");
  CREATE INDEX "_posts_v_rels_categories_id_idx" ON "_posts_v_rels" USING btree ("categories_id");
  CREATE INDEX "_posts_v_rels_users_id_idx" ON "_posts_v_rels" USING btree ("users_id");
  CREATE INDEX "categories_breadcrumbs_order_idx" ON "categories_breadcrumbs" USING btree ("_order");
  CREATE INDEX "categories_breadcrumbs_parent_id_idx" ON "categories_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "categories_breadcrumbs_doc_idx" ON "categories_breadcrumbs" USING btree ("doc_id");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_id");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "media_folder_idx" ON "media" USING btree ("folder_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_medium_sizes_medium_filename_idx" ON "media" USING btree ("sizes_medium_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");
  CREATE INDEX "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");
  CREATE INDEX "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");
  CREATE INDEX "redirects_rels_pages_id_idx" ON "redirects_rels" USING btree ("pages_id");
  CREATE INDEX "redirects_rels_posts_id_idx" ON "redirects_rels" USING btree ("posts_id");
  CREATE INDEX "redirects_rels_projects_id_idx" ON "redirects_rels" USING btree ("projects_id");
  CREATE INDEX "redirects_rels_services_id_idx" ON "redirects_rels" USING btree ("services_id");
  CREATE INDEX "forms_blocks_checkbox_order_idx" ON "forms_blocks_checkbox" USING btree ("_order");
  CREATE INDEX "forms_blocks_checkbox_parent_id_idx" ON "forms_blocks_checkbox" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_checkbox_path_idx" ON "forms_blocks_checkbox" USING btree ("_path");
  CREATE INDEX "forms_blocks_country_order_idx" ON "forms_blocks_country" USING btree ("_order");
  CREATE INDEX "forms_blocks_country_parent_id_idx" ON "forms_blocks_country" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_country_path_idx" ON "forms_blocks_country" USING btree ("_path");
  CREATE INDEX "forms_blocks_email_order_idx" ON "forms_blocks_email" USING btree ("_order");
  CREATE INDEX "forms_blocks_email_parent_id_idx" ON "forms_blocks_email" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_email_path_idx" ON "forms_blocks_email" USING btree ("_path");
  CREATE INDEX "forms_blocks_message_order_idx" ON "forms_blocks_message" USING btree ("_order");
  CREATE INDEX "forms_blocks_message_parent_id_idx" ON "forms_blocks_message" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_message_path_idx" ON "forms_blocks_message" USING btree ("_path");
  CREATE INDEX "forms_blocks_number_order_idx" ON "forms_blocks_number" USING btree ("_order");
  CREATE INDEX "forms_blocks_number_parent_id_idx" ON "forms_blocks_number" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_number_path_idx" ON "forms_blocks_number" USING btree ("_path");
  CREATE INDEX "forms_blocks_select_options_order_idx" ON "forms_blocks_select_options" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_options_parent_id_idx" ON "forms_blocks_select_options" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_order_idx" ON "forms_blocks_select" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_parent_id_idx" ON "forms_blocks_select" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_path_idx" ON "forms_blocks_select" USING btree ("_path");
  CREATE INDEX "forms_blocks_state_order_idx" ON "forms_blocks_state" USING btree ("_order");
  CREATE INDEX "forms_blocks_state_parent_id_idx" ON "forms_blocks_state" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_state_path_idx" ON "forms_blocks_state" USING btree ("_path");
  CREATE INDEX "forms_blocks_text_order_idx" ON "forms_blocks_text" USING btree ("_order");
  CREATE INDEX "forms_blocks_text_parent_id_idx" ON "forms_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_text_path_idx" ON "forms_blocks_text" USING btree ("_path");
  CREATE INDEX "forms_blocks_textarea_order_idx" ON "forms_blocks_textarea" USING btree ("_order");
  CREATE INDEX "forms_blocks_textarea_parent_id_idx" ON "forms_blocks_textarea" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_textarea_path_idx" ON "forms_blocks_textarea" USING btree ("_path");
  CREATE INDEX "forms_emails_order_idx" ON "forms_emails" USING btree ("_order");
  CREATE INDEX "forms_emails_parent_id_idx" ON "forms_emails" USING btree ("_parent_id");
  CREATE INDEX "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX "forms_created_at_idx" ON "forms" USING btree ("created_at");
  CREATE INDEX "form_submissions_submission_data_order_idx" ON "form_submissions_submission_data" USING btree ("_order");
  CREATE INDEX "form_submissions_submission_data_parent_id_idx" ON "form_submissions_submission_data" USING btree ("_parent_id");
  CREATE INDEX "form_submissions_form_idx" ON "form_submissions" USING btree ("form_id");
  CREATE INDEX "form_submissions_status_idx" ON "form_submissions" USING btree ("status");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE INDEX "search_categories_order_idx" ON "search_categories" USING btree ("_order");
  CREATE INDEX "search_categories_parent_id_idx" ON "search_categories" USING btree ("_parent_id");
  CREATE INDEX "search_slug_idx" ON "search" USING btree ("slug");
  CREATE INDEX "search_meta_meta_image_idx" ON "search" USING btree ("meta_image_id");
  CREATE INDEX "search_updated_at_idx" ON "search" USING btree ("updated_at");
  CREATE INDEX "search_created_at_idx" ON "search" USING btree ("created_at");
  CREATE INDEX "search_rels_order_idx" ON "search_rels" USING btree ("order");
  CREATE INDEX "search_rels_parent_idx" ON "search_rels" USING btree ("parent_id");
  CREATE INDEX "search_rels_path_idx" ON "search_rels" USING btree ("path");
  CREATE INDEX "search_rels_posts_id_idx" ON "search_rels" USING btree ("posts_id");
  CREATE INDEX "search_rels_projects_id_idx" ON "search_rels" USING btree ("projects_id");
  CREATE INDEX "search_rels_services_id_idx" ON "search_rels" USING btree ("services_id");
  CREATE INDEX "search_rels_pages_id_idx" ON "search_rels" USING btree ("pages_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_folders_folder_type_order_idx" ON "payload_folders_folder_type" USING btree ("order");
  CREATE INDEX "payload_folders_folder_type_parent_idx" ON "payload_folders_folder_type" USING btree ("parent_id");
  CREATE INDEX "payload_folders_name_idx" ON "payload_folders" USING btree ("name");
  CREATE INDEX "payload_folders_folder_idx" ON "payload_folders" USING btree ("folder_id");
  CREATE INDEX "payload_folders_updated_at_idx" ON "payload_folders" USING btree ("updated_at");
  CREATE INDEX "payload_folders_created_at_idx" ON "payload_folders" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_equipment_id_idx" ON "payload_locked_documents_rels" USING btree ("equipment_id");
  CREATE INDEX "payload_locked_documents_rels_service_areas_id_idx" ON "payload_locked_documents_rels" USING btree ("service_areas_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_search_id_idx" ON "payload_locked_documents_rels" USING btree ("search_id");
  CREATE INDEX "payload_locked_documents_rels_payload_folders_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_folders_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_socials_order_idx" ON "site_settings_socials" USING btree ("_order");
  CREATE INDEX "site_settings_socials_parent_id_idx" ON "site_settings_socials" USING btree ("_parent_id");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_logo_on_dark_idx" ON "site_settings" USING btree ("logo_on_dark_id");
  CREATE INDEX "site_settings_logo_mark_idx" ON "site_settings" USING btree ("logo_mark_id");
  CREATE INDEX "site_settings_favicon_idx" ON "site_settings" USING btree ("favicon_id");
  CREATE INDEX "site_settings_default_og_image_idx" ON "site_settings" USING btree ("default_og_image_id");
  CREATE INDEX "header_nav_items_children_order_idx" ON "header_nav_items_children" USING btree ("_order");
  CREATE INDEX "header_nav_items_children_parent_id_idx" ON "header_nav_items_children" USING btree ("_parent_id");
  CREATE INDEX "header_nav_items_order_idx" ON "header_nav_items" USING btree ("_order");
  CREATE INDEX "header_nav_items_parent_id_idx" ON "header_nav_items" USING btree ("_parent_id");
  CREATE INDEX "header_rels_order_idx" ON "header_rels" USING btree ("order");
  CREATE INDEX "header_rels_parent_idx" ON "header_rels" USING btree ("parent_id");
  CREATE INDEX "header_rels_path_idx" ON "header_rels" USING btree ("path");
  CREATE INDEX "header_rels_pages_id_idx" ON "header_rels" USING btree ("pages_id");
  CREATE INDEX "header_rels_posts_id_idx" ON "header_rels" USING btree ("posts_id");
  CREATE INDEX "header_rels_services_id_idx" ON "header_rels" USING btree ("services_id");
  CREATE INDEX "header_rels_projects_id_idx" ON "header_rels" USING btree ("projects_id");
  CREATE INDEX "header_rels_service_areas_id_idx" ON "header_rels" USING btree ("service_areas_id");
  CREATE INDEX "footer_columns_nav_items_order_idx" ON "footer_columns_nav_items" USING btree ("_order");
  CREATE INDEX "footer_columns_nav_items_parent_id_idx" ON "footer_columns_nav_items" USING btree ("_parent_id");
  CREATE INDEX "footer_columns_order_idx" ON "footer_columns" USING btree ("_order");
  CREATE INDEX "footer_columns_parent_id_idx" ON "footer_columns" USING btree ("_parent_id");
  CREATE INDEX "footer_legal_links_order_idx" ON "footer_legal_links" USING btree ("_order");
  CREATE INDEX "footer_legal_links_parent_id_idx" ON "footer_legal_links" USING btree ("_parent_id");
  CREATE INDEX "footer_rels_order_idx" ON "footer_rels" USING btree ("order");
  CREATE INDEX "footer_rels_parent_idx" ON "footer_rels" USING btree ("parent_id");
  CREATE INDEX "footer_rels_path_idx" ON "footer_rels" USING btree ("path");
  CREATE INDEX "footer_rels_pages_id_idx" ON "footer_rels" USING btree ("pages_id");
  CREATE INDEX "footer_rels_posts_id_idx" ON "footer_rels" USING btree ("posts_id");
  CREATE INDEX "footer_rels_services_id_idx" ON "footer_rels" USING btree ("services_id");
  CREATE INDEX "footer_rels_projects_id_idx" ON "footer_rels" USING btree ("projects_id");
  CREATE INDEX "footer_rels_service_areas_id_idx" ON "footer_rels" USING btree ("service_areas_id");
  CREATE INDEX "listing_pages_projects_filters_order_idx" ON "listing_pages_projects_filters" USING btree ("order");
  CREATE INDEX "listing_pages_projects_filters_parent_idx" ON "listing_pages_projects_filters" USING btree ("parent_id");
  CREATE INDEX "listing_pages_projects_size_buckets_order_idx" ON "listing_pages_projects_size_buckets" USING btree ("_order");
  CREATE INDEX "listing_pages_projects_size_buckets_parent_id_idx" ON "listing_pages_projects_size_buckets" USING btree ("_parent_id");
  CREATE INDEX "listing_pages_projects_projects_image_idx" ON "listing_pages" USING btree ("projects_image_id");
  CREATE INDEX "listing_pages_services_services_image_idx" ON "listing_pages" USING btree ("services_image_id");
  CREATE INDEX "listing_pages_posts_posts_image_idx" ON "listing_pages" USING btree ("posts_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_hero_home_links" CASCADE;
  DROP TABLE "pages_blocks_hero_home_trust" CASCADE;
  DROP TABLE "pages_blocks_hero_home" CASCADE;
  DROP TABLE "pages_blocks_page_hero_links" CASCADE;
  DROP TABLE "pages_blocks_page_hero" CASCADE;
  DROP TABLE "pages_blocks_services_grid" CASCADE;
  DROP TABLE "pages_blocks_featured_projects" CASCADE;
  DROP TABLE "pages_blocks_split_links" CASCADE;
  DROP TABLE "pages_blocks_split" CASCADE;
  DROP TABLE "pages_blocks_cards_items" CASCADE;
  DROP TABLE "pages_blocks_cards" CASCADE;
  DROP TABLE "pages_blocks_steps_steps" CASCADE;
  DROP TABLE "pages_blocks_steps" CASCADE;
  DROP TABLE "pages_blocks_stats_items" CASCADE;
  DROP TABLE "pages_blocks_stats" CASCADE;
  DROP TABLE "pages_blocks_equipment_grid_categories" CASCADE;
  DROP TABLE "pages_blocks_equipment_grid" CASCADE;
  DROP TABLE "pages_blocks_checklist_items" CASCADE;
  DROP TABLE "pages_blocks_checklist" CASCADE;
  DROP TABLE "pages_blocks_testimonials" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages_blocks_service_areas" CASCADE;
  DROP TABLE "pages_blocks_gallery" CASCADE;
  DROP TABLE "pages_blocks_contact_section" CASCADE;
  DROP TABLE "pages_blocks_cta_band" CASCADE;
  DROP TABLE "pages_blocks_content_columns" CASCADE;
  DROP TABLE "pages_blocks_content" CASCADE;
  DROP TABLE "pages_blocks_media_block" CASCADE;
  DROP TABLE "pages_blocks_form_block" CASCADE;
  DROP TABLE "pages_blocks_archive" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_home_links" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_home_trust" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_home" CASCADE;
  DROP TABLE "_pages_v_blocks_page_hero_links" CASCADE;
  DROP TABLE "_pages_v_blocks_page_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_services_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_featured_projects" CASCADE;
  DROP TABLE "_pages_v_blocks_split_links" CASCADE;
  DROP TABLE "_pages_v_blocks_split" CASCADE;
  DROP TABLE "_pages_v_blocks_cards_items" CASCADE;
  DROP TABLE "_pages_v_blocks_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_steps_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_items" CASCADE;
  DROP TABLE "_pages_v_blocks_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_equipment_grid_categories" CASCADE;
  DROP TABLE "_pages_v_blocks_equipment_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_checklist_items" CASCADE;
  DROP TABLE "_pages_v_blocks_checklist" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials" CASCADE;
  DROP TABLE "_pages_v_blocks_faq" CASCADE;
  DROP TABLE "_pages_v_blocks_service_areas" CASCADE;
  DROP TABLE "_pages_v_blocks_gallery" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_section" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_band" CASCADE;
  DROP TABLE "_pages_v_blocks_content_columns" CASCADE;
  DROP TABLE "_pages_v_blocks_content" CASCADE;
  DROP TABLE "_pages_v_blocks_media_block" CASCADE;
  DROP TABLE "_pages_v_blocks_form_block" CASCADE;
  DROP TABLE "_pages_v_blocks_archive" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "projects_gallery" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_texts" CASCADE;
  DROP TABLE "projects_rels" CASCADE;
  DROP TABLE "_projects_v_version_gallery" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "_projects_v_texts" CASCADE;
  DROP TABLE "_projects_v_rels" CASCADE;
  DROP TABLE "services_highlights" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "services_rels" CASCADE;
  DROP TABLE "equipment_specs" CASCADE;
  DROP TABLE "equipment" CASCADE;
  DROP TABLE "service_areas" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "posts_populated_authors" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v_version_populated_authors" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP TABLE "categories_breadcrumbs" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "redirects_rels" CASCADE;
  DROP TABLE "forms_blocks_checkbox" CASCADE;
  DROP TABLE "forms_blocks_country" CASCADE;
  DROP TABLE "forms_blocks_email" CASCADE;
  DROP TABLE "forms_blocks_message" CASCADE;
  DROP TABLE "forms_blocks_number" CASCADE;
  DROP TABLE "forms_blocks_select_options" CASCADE;
  DROP TABLE "forms_blocks_select" CASCADE;
  DROP TABLE "forms_blocks_state" CASCADE;
  DROP TABLE "forms_blocks_text" CASCADE;
  DROP TABLE "forms_blocks_textarea" CASCADE;
  DROP TABLE "forms_emails" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "form_submissions_submission_data" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "search_categories" CASCADE;
  DROP TABLE "search" CASCADE;
  DROP TABLE "search_rels" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_folders_folder_type" CASCADE;
  DROP TABLE "payload_folders" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_socials" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "theme" CASCADE;
  DROP TABLE "header_nav_items_children" CASCADE;
  DROP TABLE "header_nav_items" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "header_rels" CASCADE;
  DROP TABLE "footer_columns_nav_items" CASCADE;
  DROP TABLE "footer_columns" CASCADE;
  DROP TABLE "footer_legal_links" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_rels" CASCADE;
  DROP TABLE "listing_pages_projects_filters" CASCADE;
  DROP TABLE "listing_pages_projects_size_buckets" CASCADE;
  DROP TABLE "listing_pages" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_hero_home_links_link_type";
  DROP TYPE "public"."enum_pages_blocks_hero_home_links_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_hero_home_variant";
  DROP TYPE "public"."enum_pages_blocks_hero_home_settings_background";
  DROP TYPE "public"."enum_pages_blocks_hero_home_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_hero_home_settings_hide_on";
  DROP TYPE "public"."enum_pages_blocks_page_hero_links_link_type";
  DROP TYPE "public"."enum_pages_blocks_page_hero_links_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_page_hero_variant";
  DROP TYPE "public"."enum_pages_blocks_page_hero_settings_background";
  DROP TYPE "public"."enum_pages_blocks_page_hero_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_page_hero_settings_hide_on";
  DROP TYPE "public"."enum_pages_blocks_services_grid_variant";
  DROP TYPE "public"."enum_pages_blocks_services_grid_source";
  DROP TYPE "public"."enum_pages_blocks_services_grid_link_to";
  DROP TYPE "public"."enum_pages_blocks_services_grid_settings_background";
  DROP TYPE "public"."enum_pages_blocks_services_grid_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_services_grid_settings_hide_on";
  DROP TYPE "public"."enum_pages_blocks_featured_projects_source";
  DROP TYPE "public"."enum_pages_blocks_featured_projects_settings_background";
  DROP TYPE "public"."enum_pages_blocks_featured_projects_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_featured_projects_settings_hide_on";
  DROP TYPE "public"."enum_pages_blocks_split_links_link_type";
  DROP TYPE "public"."enum_pages_blocks_split_links_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_split_image_position";
  DROP TYPE "public"."enum_pages_blocks_split_settings_background";
  DROP TYPE "public"."enum_pages_blocks_split_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_split_settings_hide_on";
  DROP TYPE "public"."enum_pages_blocks_cards_items_icon";
  DROP TYPE "public"."enum_pages_blocks_cards_variant";
  DROP TYPE "public"."enum_pages_blocks_cards_columns";
  DROP TYPE "public"."enum_pages_blocks_cards_settings_background";
  DROP TYPE "public"."enum_pages_blocks_cards_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_cards_settings_hide_on";
  DROP TYPE "public"."enum_pages_blocks_steps_settings_background";
  DROP TYPE "public"."enum_pages_blocks_steps_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_steps_settings_hide_on";
  DROP TYPE "public"."enum_pages_blocks_stats_settings_background";
  DROP TYPE "public"."enum_pages_blocks_stats_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_stats_settings_hide_on";
  DROP TYPE "public"."enum_pages_blocks_equipment_grid_categories";
  DROP TYPE "public"."enum_pages_blocks_equipment_grid_settings_background";
  DROP TYPE "public"."enum_pages_blocks_equipment_grid_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_equipment_grid_settings_hide_on";
  DROP TYPE "public"."enum_pages_blocks_checklist_settings_background";
  DROP TYPE "public"."enum_pages_blocks_checklist_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_checklist_settings_hide_on";
  DROP TYPE "public"."enum_pages_blocks_testimonials_source";
  DROP TYPE "public"."enum_pages_blocks_testimonials_settings_background";
  DROP TYPE "public"."enum_pages_blocks_testimonials_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_testimonials_settings_hide_on";
  DROP TYPE "public"."enum_pages_blocks_faq_settings_background";
  DROP TYPE "public"."enum_pages_blocks_faq_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_faq_settings_hide_on";
  DROP TYPE "public"."enum_pages_blocks_service_areas_settings_background";
  DROP TYPE "public"."enum_pages_blocks_service_areas_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_service_areas_settings_hide_on";
  DROP TYPE "public"."enum_pages_blocks_gallery_columns";
  DROP TYPE "public"."enum_pages_blocks_gallery_settings_background";
  DROP TYPE "public"."enum_pages_blocks_gallery_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_gallery_settings_hide_on";
  DROP TYPE "public"."enum_pages_blocks_contact_section_settings_background";
  DROP TYPE "public"."enum_pages_blocks_contact_section_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_contact_section_settings_hide_on";
  DROP TYPE "public"."enum_pages_blocks_cta_band_style";
  DROP TYPE "public"."enum_pages_blocks_cta_band_settings_background";
  DROP TYPE "public"."enum_pages_blocks_cta_band_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_cta_band_settings_hide_on";
  DROP TYPE "public"."enum_pages_blocks_content_columns_size";
  DROP TYPE "public"."enum_pages_blocks_content_columns_link_type";
  DROP TYPE "public"."enum_pages_blocks_content_columns_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_archive_populate_by";
  DROP TYPE "public"."enum_pages_blocks_archive_relation_to";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_hero_home_links_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_hero_home_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_hero_home_variant";
  DROP TYPE "public"."enum__pages_v_blocks_hero_home_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_hero_home_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_hero_home_settings_hide_on";
  DROP TYPE "public"."enum__pages_v_blocks_page_hero_links_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_page_hero_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_page_hero_variant";
  DROP TYPE "public"."enum__pages_v_blocks_page_hero_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_page_hero_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_page_hero_settings_hide_on";
  DROP TYPE "public"."enum__pages_v_blocks_services_grid_variant";
  DROP TYPE "public"."enum__pages_v_blocks_services_grid_source";
  DROP TYPE "public"."enum__pages_v_blocks_services_grid_link_to";
  DROP TYPE "public"."enum__pages_v_blocks_services_grid_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_services_grid_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_services_grid_settings_hide_on";
  DROP TYPE "public"."enum__pages_v_blocks_featured_projects_source";
  DROP TYPE "public"."enum__pages_v_blocks_featured_projects_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_featured_projects_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_featured_projects_settings_hide_on";
  DROP TYPE "public"."enum__pages_v_blocks_split_links_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_split_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_split_image_position";
  DROP TYPE "public"."enum__pages_v_blocks_split_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_split_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_split_settings_hide_on";
  DROP TYPE "public"."enum__pages_v_blocks_cards_items_icon";
  DROP TYPE "public"."enum__pages_v_blocks_cards_variant";
  DROP TYPE "public"."enum__pages_v_blocks_cards_columns";
  DROP TYPE "public"."enum__pages_v_blocks_cards_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_cards_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_cards_settings_hide_on";
  DROP TYPE "public"."enum__pages_v_blocks_steps_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_steps_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_steps_settings_hide_on";
  DROP TYPE "public"."enum__pages_v_blocks_stats_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_stats_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_stats_settings_hide_on";
  DROP TYPE "public"."enum__pages_v_blocks_equipment_grid_categories";
  DROP TYPE "public"."enum__pages_v_blocks_equipment_grid_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_equipment_grid_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_equipment_grid_settings_hide_on";
  DROP TYPE "public"."enum__pages_v_blocks_checklist_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_checklist_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_checklist_settings_hide_on";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_source";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_settings_hide_on";
  DROP TYPE "public"."enum__pages_v_blocks_faq_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_faq_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_faq_settings_hide_on";
  DROP TYPE "public"."enum__pages_v_blocks_service_areas_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_service_areas_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_service_areas_settings_hide_on";
  DROP TYPE "public"."enum__pages_v_blocks_gallery_columns";
  DROP TYPE "public"."enum__pages_v_blocks_gallery_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_gallery_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_gallery_settings_hide_on";
  DROP TYPE "public"."enum__pages_v_blocks_contact_section_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_contact_section_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_contact_section_settings_hide_on";
  DROP TYPE "public"."enum__pages_v_blocks_cta_band_style";
  DROP TYPE "public"."enum__pages_v_blocks_cta_band_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_cta_band_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_cta_band_settings_hide_on";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_size";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_archive_populate_by";
  DROP TYPE "public"."enum__pages_v_blocks_archive_relation_to";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_projects_client_type";
  DROP TYPE "public"."enum_projects_lot_unit";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_version_client_type";
  DROP TYPE "public"."enum__projects_v_version_lot_unit";
  DROP TYPE "public"."enum__projects_v_version_status";
  DROP TYPE "public"."enum_services_icon";
  DROP TYPE "public"."enum_equipment_category";
  DROP TYPE "public"."enum_equipment_icon";
  DROP TYPE "public"."enum_testimonials_source";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_redirects_to_type";
  DROP TYPE "public"."enum_forms_confirmation_type";
  DROP TYPE "public"."enum_form_submissions_status";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_payload_folders_folder_type";
  DROP TYPE "public"."enum_site_settings_socials_platform";
  DROP TYPE "public"."enum_site_settings_business_type";
  DROP TYPE "public"."enum_theme_preset";
  DROP TYPE "public"."enum_theme_font_display";
  DROP TYPE "public"."enum_theme_font_body";
  DROP TYPE "public"."enum_theme_heading_case";
  DROP TYPE "public"."enum_theme_radius";
  DROP TYPE "public"."enum_theme_button_shape";
  DROP TYPE "public"."enum_theme_card_style";
  DROP TYPE "public"."enum_theme_container";
  DROP TYPE "public"."enum_theme_header_style";
  DROP TYPE "public"."enum_theme_footer_style";
  DROP TYPE "public"."enum_header_nav_items_children_link_type";
  DROP TYPE "public"."enum_header_nav_items_link_type";
  DROP TYPE "public"."enum_footer_columns_nav_items_link_type";
  DROP TYPE "public"."enum_footer_legal_links_link_type";
  DROP TYPE "public"."enum_listing_pages_projects_filters";`)
}
