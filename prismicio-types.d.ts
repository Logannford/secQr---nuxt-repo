// Code generated by Slice Machine. DO NOT EDIT.

import type * as prismic from "@prismicio/client";

type Simplify<T> = { [KeyType in keyof T]: T[KeyType] };

type GlobalNavDocumentDataSlicesSlice = NavigationItemSlice;

/**
 * Content for global nav documents
 */
interface GlobalNavDocumentData {
  /**
   * Name field in *global nav*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: global_nav.name
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  name: prismic.RichTextField;

  /**
   * Slice Zone field in *global nav*
   *
   * - **Field Type**: Slice Zone
   * - **Placeholder**: *None*
   * - **API ID Path**: global_nav.slices[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#slices
   */
  slices: prismic.SliceZone<GlobalNavDocumentDataSlicesSlice>;
}

/**
 * global nav document from Prismic
 *
 * - **API ID**: `global_nav`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type GlobalNavDocument<Lang extends string = string> =
  prismic.PrismicDocumentWithUID<
    Simplify<GlobalNavDocumentData>,
    "global_nav",
    Lang
  >;

export type AllDocumentTypes = GlobalNavDocument;

/**
 * Primary content in *NavigationItem → Primary*
 */
export interface NavigationItemSliceDefaultPrimary {
  /**
   * Name field in *NavigationItem → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: navigation_item.primary.name
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  name: prismic.RichTextField;

  /**
   * item link field in *NavigationItem → Primary*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: navigation_item.primary.item_link
   * - **Documentation**: https://prismic.io/docs/field#link-content-relationship
   */
  item_link: prismic.LinkField;
}

/**
 * Primary content in *NavigationItem → Items*
 */
export interface NavigationItemSliceDefaultItem {
  /**
   * child_name field in *NavigationItem → Items*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: navigation_item.items[].child_name
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  child_name: prismic.RichTextField;

  /**
   * child link field in *NavigationItem → Items*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: navigation_item.items[].child_link
   * - **Documentation**: https://prismic.io/docs/field#link-content-relationship
   */
  child_link: prismic.LinkField;
}

/**
 * Default variation for NavigationItem Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type NavigationItemSliceDefault = prismic.SharedSliceVariation<
  "default",
  Simplify<NavigationItemSliceDefaultPrimary>,
  Simplify<NavigationItemSliceDefaultItem>
>;

/**
 * Slice variation for *NavigationItem*
 */
type NavigationItemSliceVariation = NavigationItemSliceDefault;

/**
 * NavigationItem Shared Slice
 *
 * - **API ID**: `navigation_item`
 * - **Description**: NavigationItem
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type NavigationItemSlice = prismic.SharedSlice<
  "navigation_item",
  NavigationItemSliceVariation
>;

declare module "@prismicio/client" {
  interface CreateClient {
    (
      repositoryNameOrEndpoint: string,
      options?: prismic.ClientConfig
    ): prismic.Client<AllDocumentTypes>;
  }

  namespace Content {
    export type {
      GlobalNavDocument,
      GlobalNavDocumentData,
      GlobalNavDocumentDataSlicesSlice,
      AllDocumentTypes,
      NavigationItemSlice,
      NavigationItemSliceDefaultPrimary,
      NavigationItemSliceDefaultItem,
      NavigationItemSliceVariation,
      NavigationItemSliceDefault,
    };
  }
}
